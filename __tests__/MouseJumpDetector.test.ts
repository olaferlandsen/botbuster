import MouseJumpDetector from '../src/detectors/MouseJumpDetector';
import Config from '../src/core/Config';
import Reporter from '../src/core/Reporter';

function createMockReporter() {
    return {
        notify: jest.fn(),
        listen: jest.fn(),
        getIssues: jest.fn(() => [])
    } as any;
}

describe('MouseJumpDetector', () => {
    let config: Config;
    let reporter: Reporter;
    let detector: MouseJumpDetector;

    beforeEach(() => {
        config = new Config({ jumpThreshold: 50 });
        reporter = createMockReporter();
        detector = new MouseJumpDetector(config, reporter);
        detector.start();
    });

    test('should report jump if distance is large and time is > 100ms', (done) => {
        const e1 = new MouseEvent('mousemove', { clientX: 0, clientY: 0 });
        document.dispatchEvent(e1);

        setTimeout(() => {
            const e2 = new MouseEvent('mousemove', { clientX: 200, clientY: 200 });
            document.dispatchEvent(e2);

            expect((reporter.notify as jest.Mock).mock.calls.length).toBeGreaterThan(0);
            expect((reporter.notify as jest.Mock).mock.calls[0][0]).toMatch(/jump/i);
            done();
        }, 150);
    });
});
