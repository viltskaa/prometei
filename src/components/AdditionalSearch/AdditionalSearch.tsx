import {Card, Checkbox, Flex, Form, FormInstance} from "antd";
import InputNumberWithButtons from "../InputNumberWithButtons/InputNumberWithButtons.tsx";

import './AdditionalSearch.css'
import {SearchDto} from "../../api/Types/types.ts";
import {useState} from "react";

export interface AdditionalSearchProps {
    form: FormInstance<SearchDto>;
}

const maxTickets = 10;

const AdditionalSearch = ({ form }: AdditionalSearchProps) => {
    const [economTickets, setEconomTickets] = useState<number>(1);
    const [businessTickets, setBusinessTickets] = useState<number>(0);

    return (
        <Flex justify='center' vertical gap='middle' className="w-100">
            <Flex justify='space-between' className="w-100" gap='small'>
                <Card className="w-100 p-1">
                    <Flex className='w-100' justify='center' align="center">
                        <p className='m-0'>Эконом класс: </p>
                    </Flex>
                </Card>
                <InputNumberWithButtons form={form}
                                        formName='countEconomic'
                                        onChange={value => setEconomTickets(value)}
                                        min={0}
                                        max={maxTickets-businessTickets}/>
            </Flex>
            <Flex justify='space-between' className="w-100" gap='small'>
                <Card className="w-100 p-1">
                    <Flex className='w-100' justify='center' align="center">
                        <p className='m-0'>Бизнес класс: </p>
                    </Flex>
                </Card>
                <InputNumberWithButtons form={form}
                                        formName='countBusiness'
                                        onChange={value => setBusinessTickets(value)}
                                        min={0}
                                        max={maxTickets-economTickets}/>
            </Flex>
            <Form.Item<SearchDto> className='mb-0' name='withPet' valuePropName='checked'>
                <Checkbox>Лечу с питомцем</Checkbox>
            </Form.Item>
            <Form.Item<SearchDto> className='mb-0' name='useGeneticAlg' valuePropName='checked'>
                <Checkbox className='text-wrap'>Составить оптимизированный маршрут с использованием генетического алгоритма</Checkbox>
            </Form.Item>
        </Flex>
    );
};

export default AdditionalSearch;