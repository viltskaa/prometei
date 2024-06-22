import {ConfigProvider, DatePicker, Flex, Form, FormInstance} from "antd";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {SearchDto} from "../../api/Types/types.ts";

import locale from 'antd/locale/ru_RU';
import 'dayjs/locale/ru';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(customParseFormat);
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('ru');

const dateFormat = 'D, MMM, YYYY';

export interface DatesSelectProps {
    form: FormInstance<SearchDto>
}

const DatesSelect = ({form}: DatesSelectProps) => {
    const firstDate = Form.useWatch('departureDate', form)
    const secondDate = Form.useWatch('returnDate', form)

    const getValueProps = (value: unknown) => {
        return {value: value && dayjs.tz(Number(value)),}
    }

    const normalize = (value: string | number | Date | dayjs.Dayjs | null | undefined) => {
        const dateString = value && dayjs(value).format("YYYY-MM-DD")
        return dateString && dayjs.tz(dateString, 'Etc/GMT').valueOf()
    }

    return (
        <ConfigProvider locale={locale}>
            <Flex className='flex-fill' align='center' justify='center' gap='small'>
                <Form.Item<SearchDto>
                    rules={[{ required: true, message: '' }]}
                    className='m-0 flex-fill'
                    name='departureDate'
                    getValueProps={getValueProps}
                    normalize={normalize}
                >
                    <DatePicker
                        style={{width:'100%'}}
                        placeholder="Когда"
                        minDate={dayjs(Date.now(), "2019-09-03")}
                        format={dateFormat}
                    />
                </Form.Item>
                <Form.Item<SearchDto>
                    className='m-0 flex-fill'
                    name='returnDate'
                    getValueProps={getValueProps}
                    normalize={normalize}
                >
                    <DatePicker
                        style={{width:'100%'}}
                        placeholder="Обратно"
                        minDate={firstDate ? dayjs.tz(firstDate, 'Etc/GMT') : undefined}
                        format={dateFormat}
                        status={secondDate && firstDate && secondDate < firstDate ? "warning" : ""}
                    />
                </Form.Item>
            </Flex>
        </ConfigProvider>
    );
};

export default DatesSelect;