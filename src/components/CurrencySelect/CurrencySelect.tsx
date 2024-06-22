import React from "react";
import {Select} from "antd";

const CurrencySelect: React.FC = () => {
    return (
        <Select
            showSearch
            style={{width: 80}}
            defaultValue={'1'}
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={[
                {
                    value: '1',
                    label: 'Rub',
                },
                {
                    value: '2',
                    label: 'Euro',
                },
                {
                    value: '3',
                    label: 'Usd',
                },
                {
                    value: '4',
                    label: 'BitCoin',
                },
            ]}
        />
    );
};

export default CurrencySelect;