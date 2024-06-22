import React from 'react';
import TicketSearch from "../TickerSearch/TicketSearch.tsx";
import {Flex} from "antd";
import {useLocation} from "react-router-dom";

const MainPage = (): React.ReactElement => {
    const {state} = useLocation();

    return (
        <Flex className='h-100' justify='center' vertical>
            <TicketSearch values={state} title='Поиск билетов' />
        </Flex>
    );
};

export default MainPage;