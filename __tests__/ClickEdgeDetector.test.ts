import ClickEdgeDetector from '../src/detectors/ClickEdgeDetector';
import Config from '../src/core/Config';
import Reporter from '../src/core/Reporter';

function createMockReporter() {
    return {
        notify: jest.fn(),
        listen: jest.fn(),
        getIssues: jest.fn(() => [])
    } as any;
}

describe('ClickEdgeDetector', () => {
    let config: Config;
    let reporter: Reporter;
    let detector: ClickEdgeDetector;

    beforeEach(() => {
        config = new Config({ edgeClickTolerance: 10 });
        reporter = createMockReporter();
        detector = new ClickEdgeDetector(config, reporter);
        detector.start();
    });


    test('should NOT report click in center of element', () => {
        const config = new Config({ edgeClickTolerance: 10 });
        const reporter = createMockReporter();
        const detector = new ClickEdgeDetector(config, reporter);
        detector.start();

        const div = document.createElement('div');
        document.body.appendChild(div);

        Object.defineProperty(div, 'getBoundingClientRect', {
            value: () => ({
                left: 0,
                top: 0,
                width: 100,
                height: 100
            })
        });

        // Click in the center
        const event = new MouseEvent('click', { clientX: 50, clientY: 50, bubbles: true });
        div.dispatchEvent(event);

        expect((reporter.notify as jest.Mock)).not.toHaveBeenCalled();
    });


});
