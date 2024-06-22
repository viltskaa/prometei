import {useState} from 'react';
import {Button, Card, ConfigProvider, DatePicker, Form, FormProps, Input, Select} from "antd";
import {useForm} from "antd/es/form/Form";
import {User} from "../../api/Types/types.ts";

import locale from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import './UserForm.css'

dayjs.extend(customParseFormat);
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('ru');

const dateFormat = 'D, MMM, YYYY';

interface UserFormProps {
    user?: User | null,
    index: number,
    onSubmit?: (user: User, index: number) => void,
    title: string
}

const UserForm = ({user, index, onSubmit, title}: UserFormProps) => {
    const [form] = useForm<User>();

    const [success, setSuccess] = useState<boolean>(false);
    const [select, setSelect] = useState<"ips" | "prf">("prf");

    const onFinish: FormProps<User>['onFinish'] = (values) => {
        setSuccess(true);
        onSubmit && onSubmit(values, index)
    };

    const onFinishFailed: FormProps<User>['onFinishFailed'] = () => {
        setSuccess(false);
    };

    const getValueProps = (value: string) => {
        return {value: value && dayjs(value)}
    }

    const normalize = (value: string | number | Date | dayjs.Dayjs | null | undefined) => {
        const dateString = value && dayjs(value).format("YYYY-MM-DD")
        return dateString && dayjs.tz(dateString, 'Etc/GMT').format("YYYY-MM-DD")
    }

    return (
        <ConfigProvider locale={locale}>
            <Card bordered={false} style={{
                width: "400px",
            }} className={"p-3 flex-fill " + (success ? "success" : "")}>
                <p className='h4'>{title}</p>
                <Form
                    onError={() => setSuccess(false)}
                    form={form}
                    name="basic"
                    initialValues={user ? user : {}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout='vertical'
                >
                    <Form.Item<User>
                        label="Почта для связи"
                        name="email"
                        rules={[
                            {required: true, message: 'Введите почту!'},
                            {type: 'email', message: 'Неверный формат почты!'}
                        ]}
                        className="w-100 mb-1"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<User>
                        label="Имя"
                        name="firstName"
                        rules={[{required: true, message: 'Введите имя'}]}
                        className="w-100 mb-1"
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item<User>
                        label="Фамилия"
                        name="lastName"
                        rules={[{required: true, message: 'Введите фамилию'}]}
                        className="w-100 mb-1"
                    >
                        <Input/>
                    </Form.Item>

                    <p className="m-0 mb-2">* Тип документа</p>
                    <Select
                        defaultValue={select}
                        onChange={(value) => setSelect(value)}
                        className="w-100 mb-1"
                        options={[{value: 'prf', label: 'Паспорт РФ'}, {value: 'ips', label: 'Международный паспорт'}]}
                    />
                    {select === "prf" && (
                        <Form.Item<User>
                            label="Серия/Номер"
                            name="passport"
                            rules={[{required: true, message: 'Введите паспорт'}, {
                                len: 10,
                                message: 'Неверный формат'
                            }]}
                            className="w-100 mb-1"
                        >
                            <Input/>
                        </Form.Item>
                    )}
                    {select === "ips" && (
                        <>
                            <Form.Item<User>
                                label="Международный паспорт"
                                name="internationalPassportNum"
                                rules={[{required: true, message: 'Введите международный паспорт'}, {
                                    len: 9,
                                    message: 'Неверный формат'
                                }]}
                                className="w-100 mb-1"
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item<User>
                                label="Дата оформления"
                                name="internationalPassportDate"
                                rules={[{required: true, message: 'Введите паспорт'}]}
                                className="w-100 mb-1"
                                getValueProps={getValueProps}
                                normalize={normalize}
                            >
                                <DatePicker style={{width: "100%"}} format={dateFormat}/>
                            </Form.Item>
                        </>
                    )}
                    <Form.Item<User> className="w-100 mb-1 mt-4">
                        <Button className='w-100' type='primary' htmlType='submit'>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Card>
        </ConfigProvider>
    );
};

export default UserForm;