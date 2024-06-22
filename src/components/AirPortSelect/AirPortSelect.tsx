import React from 'react';
import {Flex, Form, Select} from "antd";
import {Airport, SearchDto} from "../../api/Types/types.ts";

export interface AirPortSelectProps {
    formName: keyof SearchDto;
    placeholder?: string
    onChange?: (value: string) => void
    value?: string
    airports: Airport[]
}

const AirPortSelect = ({formName, placeholder, onChange, airports} : AirPortSelectProps): React.ReactElement => {
    const onSelectedValueChange = (value: string) => {
        if (onChange) {
            onChange(value)
        }
    }

    return (
        <Form.Item<SearchDto>
            required
            rules={[{ required: true, message: '' }]}
            name={formName}
            className='m-0 w-25 flex-fill'
        >
            <Select
                allowClear
                showSearch
                style={{width: "100%"}}
                placeholder={placeholder ?? ""}
                optionFilterProp="children"
                notFoundContent={(<p className='text-center text-white m-0'>Ничего не найдено</p>)}
                filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={airports}
                optionRender={(option) => (
                    <Flex justify="space-between">
                        <div className="">✈️ {option.value}</div>
                    </Flex>
                )}
                onChange={onSelectedValueChange}
            />
        </Form.Item>
    );
};

export default AirPortSelect;