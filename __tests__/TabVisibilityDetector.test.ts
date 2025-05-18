import TabVisibilityDetector from '../src/detectors/TabVisibilityDetector';
import Reporter from '../src/core/Reporter';
import Config from '../src/core/Config';

describe('TabVisibilityDetector', () => {
    function createMockReporter(): Reporter {
        return {
            notify: jest.fn(),
            listen: jest.fn(),
            getIssues: jest.fn(() => [])
        } as any;
    }

    test('should notify on window blur not caused by input', () => {
        const config = new Config();
        const reporter = createMockReporter();
        const detector = new TabVisibilityDetector(config, reporter);
        detector.start();

        Object.defineProperty(document, 'activeElement', {
            configurable: true,
            get: () => null
        });

        const blurEvent = new FocusEvent('blur');
        window.dispatchEvent(blurEvent);

        expect((reporter.notify as jest.Mock)).toHaveBeenCalledWith(
            expect.stringMatching(/blurred the window/i),
            blurEvent
        );
    });
});
