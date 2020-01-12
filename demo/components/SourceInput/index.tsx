import {useState, useCallback, FC, CSSProperties} from 'react';
import {Input, Button} from 'antd';

interface Props {
    style: CSSProperties;
    onSubmit(value: string): void;
}

const SourceInput: FC<Props> = ({style, onSubmit}) => {
    const [value, setValue] = useState('');
    const typeSource = useCallback(e => setValue(e.target.value), []);
    const submitSource = useCallback(() => onSubmit(value), [value, onSubmit]);

    return (
        <div style={{display: 'flex', ...style}}>
            <Input
                style={{flex: 1}}
                placeholder="Type a single line of source code"
                value={value}
                onChange={typeSource}
            />
            <Button type="primary" onClick={submitSource}>Tokenize</Button>
        </div>
    );
};

export default SourceInput;
