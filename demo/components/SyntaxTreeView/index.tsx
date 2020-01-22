import {useMemo, FC, HTMLAttributes} from 'react';
import {TreeNode, LineOfSyntax} from '../../../src';
import Chart from '../Chart';

interface Props extends HTMLAttributes<HTMLDivElement> {
    syntax?: LineOfSyntax;
}

interface ViewNode {
    type: string;
    name: string;
    children?: ViewNode[];
}

const transformTreeData = (node: TreeNode | string): ViewNode => {
    if (typeof node === 'string') {
        return {
            type: 'text',
            name: node,
        };
    }

    const text = node.type === 'element' ? (node.properties?.className?.[1] ?? 'unknown') : node.type;
    const treeNode: ViewNode = {
        type: node.type,
        name: text,
    };
    if (node.children) {
        treeNode.children = node.children.map(transformTreeData);
    }
    return treeNode;
};

const SyntaxTreeView: FC<Props> = ({syntax, ...props}) => {
    const options = useMemo(
        () => {
            return {
                tooltip: {show: false},
                series: [
                    {
                        type: 'tree',
                        data: syntax && [transformTreeData({type: 'root', children: syntax})],
                        symbol: 'emptyCircle',
                        orient: 'vertical',
                        expandAndCollapse: false,
                        label: {
                            position: 'left',
                            fontSize: 12,
                            color: '#aaa',
                            rotate: -90,
                        },
                        leaves: {
                            label: {
                                position: 'bottom',
                                align: 'left',
                                color: '#000',
                                fontSize: 14,
                                rotate: 0,
                            },
                        },
                        animationDurationUpdate: 750,
                    },
                ],
            };
        },
        [syntax]
    );

    return <Chart options={options} {...props} />;
};

export default SyntaxTreeView;
