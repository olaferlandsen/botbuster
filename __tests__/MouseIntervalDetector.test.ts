import MouseIntervalDetector from '../src/detectors/MouseIntervalDetector';
import Config from '../src/core/Config';
import Reporter from '../src/core/Reporter';

function createMockReporter() {
    return {
        notify: jest.fn(),
        listen: jest.fn(),
        getIssues: jest.fn(() => [])
    } as any;
}

describe('MouseIntervalDetector', () => {
    let detector: MouseIntervalDetector;

    beforeEach(() => {
        const config = new Config({ movementIntervalTolerance: 2 });
        const reporter = createMockReporter();
        detector = new MouseIntervalDetector(config, reporter);
        detector.start();
    });

    test('should flag rapid mousemove events', () => {
        const e1 = new MouseEvent('mousemove');
        document.dispatchEvent(e1);

        const e2 = new MouseEvent('mousemove');
        document.dispatchEvent(e2);

        expect((detector as any).reporter.notify).toHaveBeenCalledWith(expect.stringMatching(/interval/i));
    });
});
