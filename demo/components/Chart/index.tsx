import {memo, useEffect, useRef, HTMLAttributes} from 'react';
import * as echarts from 'echarts';
import createResizeDetector from 'element-resize-detector';

const resizeDetector = createResizeDetector({strategy: 'scroll'});

interface Props extends HTMLAttributes<HTMLDivElement> {
    options: any;
}

function Chart({options, ...props}: Props) {
    const chart = useRef<echarts.ECharts | null>(null);
    const container = useRef<HTMLDivElement>(null);
    useEffect(
        () => {
            const element = container.current;

            if (!element) {
                return;
            }

            const instance = echarts.init(element);
            chart.current = instance;
            resizeDetector.listenTo(element, () => instance.resize());

            return () => {
                resizeDetector.removeAllListeners(element);
                instance.dispose();
            };
        },
        []
    );
    useEffect(
        () => {
            if (chart.current && options) {
                chart.current.setOption(options);
            }
        },
        [options]
    );

    return <div ref={container} {...props} />;
}

export default memo(Chart);
