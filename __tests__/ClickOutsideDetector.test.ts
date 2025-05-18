import ClickOutsideDetector from '../src/detectors/ClickOutsideDetector';
import Config from '../src/core/Config';

function createMockReporter() {
    return {
        notify: jest.fn(),
        listen: jest.fn(),
        getIssues: jest.fn(() => [])
    } as any;
}

describe('ClickOutsideDetector', () => {
    let detector: ClickOutsideDetector;

    beforeEach(() => {
        const config = new Config();
        const reporter = createMockReporter();
        detector = new ClickOutsideDetector(config, reporter);
        detector.start();
    });

    test('should detect click outside real target', () => {
        const target = document.createElement('button');
        document.body.appendChild(target);

        // Manual override (no spy)
        document.elementFromPoint = () => document.body;

        const event = new MouseEvent('click', { clientX: 1, clientY: 1, bubbles: true });
        target.dispatchEvent(event);

        expect((detector as any).reporter.notify).toHaveBeenCalledWith(expect.stringMatching(/outside/i), expect.anything());
    });
});
