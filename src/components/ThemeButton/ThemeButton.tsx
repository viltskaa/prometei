import React, {useContext} from 'react';
import {Button, Tooltip} from "antd";
import {SunOutlined, SunFilled} from "@ant-design/icons";
import {ThemeContext} from "../../main.tsx";

const ThemeButton = (): React.ReactElement => {
    const {theme, setTheme} = useContext(ThemeContext);

    const onClick = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <Tooltip title="Изменить тему" placement="top">
            <Button
                type={theme === 'light' ? 'default' : 'primary'}
                onClick={onClick}
                icon={theme === 'light' ? <SunOutlined /> : <SunFilled />}
            />
        </Tooltip>
    );
};

export default ThemeButton;