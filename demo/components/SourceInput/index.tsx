import {useState, useCallback, CSSProperties, ChangeEvent} from 'react';
import {Input, Button} from 'antd';

interface Props {
    placeholder: string;
    submitText: string;
    disabled?: boolean;
    style: CSSProperties;
    onSubmit(value: string): void;
}

export default function SourceInput({style, disabled, placeholder, submitText, onSubmit}: Props) {
    const [value, setValue] = useState('');
    const typeSource = useCallback((e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value), []);
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
}
