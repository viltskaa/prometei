import React from 'react';
import {Button, Flex, Form, FormInstance, InputNumber, InputNumberProps} from "antd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import {SearchDto} from "../../api/Types/types.ts";

export interface InputNumberWithButtonsProps {
    form: FormInstance<SearchDto>;
    formName: keyof SearchDto;
    defaultValue?: number;
    max?: number,
    min?: number,
    onChange?: (value: number) => void,
}

const InputNumberWithButtons = ({ form, formName, min, max, onChange } : InputNumberWithButtonsProps) => {
    const checkValueAndSet = (value: number) => {
        if (onChange !== undefined) {
            onChange(value);
        }

        if (min === undefined || max === undefined) {
            form.setFieldValue(formName, value)
            return;
        }

        if (value >= min && value <= max) {
            form.setFieldValue(formName, value)
        }
    }

    const onChangeInput: InputNumberProps['onChange'] = (value) => {
        if (value !== null && Number.isInteger(value.valueOf())) {
            checkValueAndSet(Number(value.valueOf()))
        }
    }

    const onPlus = (event : React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()
        checkValueAndSet(form.getFieldValue(formName) + 1)
    }

    const onMinus = (event : React.MouseEvent<HTMLInputElement>) => {
        event.preventDefault()
        checkValueAndSet(form.getFieldValue(formName) - 1)
    }

    return (
        <Flex gap='small'>
            <Button onClick={onPlus} icon={<PlusOutlined />}/>
            <Form.Item<SearchDto> name={formName} className='mb-0' shouldUpdate>
                <InputNumber
                    variant='filled'
                    controls={false}
                    min={min ?? 0}
                    max={max}
                    onChange={onChangeInput}
                />
            </Form.Item>
            <Button onClick={onMinus} icon={<MinusOutlined />} />
        </Flex>
    );
};

export default InputNumberWithButtons;