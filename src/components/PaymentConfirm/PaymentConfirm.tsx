import {Button, Card, Flex, Layout, theme} from "antd";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import requests from "../../api/Requests/PaymentApi.ts";

const PaymentConfirm = () => {
    const {
        token: {colorBgContainer},
    } = theme.useToken();
    const navigate = useNavigate();
    const [searchParams, ] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const hash = searchParams.get("paymentHash")
        hash && requests.confirm(hash)
            .then(req => {
                if (typeof req == 'boolean') {
                    setError(!req)
                } else {
                    setError(true);
                }
                setLoading(false);
            })
    }, [searchParams]);

    return (
        <Layout className='h-100' style={{
            background: colorBgContainer,
        }}>
            <Flex justify='center' align='center' className='h-100'>
                <Card loading={loading} style={{width: 400}} className='p-3'>
                    <Flex justify='center' gap='small' align='center' vertical>
                        {error && (
                            <>
                                <p className='h2'>Оплата не прошла!</p>
                                <p className='text-secondary m-0 h4'>Истекло время оплаты</p>
                            </>
                        )}
                        {!error && (
                            <>
                                <p className='h2 text-center text-wrap'>Оплата успешно проведена!</p>
                                <p className='text-secondary m-0 h4'>Спасибо за покупку</p>
                            </>
                        )}
                        <Button onClick={() => navigate("/")}>Вернуться на главную страницу</Button>
                    </Flex>
                </Card>
            </Flex>
        </Layout>
    );
};

export default PaymentConfirm;