import {useState, useCallback, FC, CSSProperties} from 'react';
import {Input, Button} from 'antd';

interface Props {
    placeholder: string;
    submitText: string;
    disabled?: boolean;
    style: CSSProperties;
    onSubmit(value: string): void;
}

const SourceInput: FC<Props> = ({style, disabled, placeholder, submitText, onSubmit}) => {
    const [value, setValue] = useState('');
    const typeSource = useCallback(e => setValue(e.target.value), []);
    const submitSource = useCallback(() => onSubmit(value), [value, onSubmit]);

    return (
        <div style={{display: 'flex', ...style}}>
            <Input
                style={{flex: 1}}
                disabled={disabled}
                placeholder={placeholder}
                value={value}
                onChange={typeSource}
            />
            <Button style={{marginLeft: 10}} type="primary" disabled={disabled} onClick={submitSource}>
                {submitText}
            </Button>
        </div>
    );
};

export default SourceInput;
