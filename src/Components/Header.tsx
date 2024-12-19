import { Badge, Input } from '@mantine/core';
import React from 'react';

const Header = () => {
    const [api, setApi] = React.useState(localStorage.getItem('_api_url')||'');

    return (
        <header>
            <div className="content-desktop">
                <div>
                    <Badge size="lg" radius={10} color="yellow">
                        <Input
                            placeholder="API地址"
                            size="md"
                            value={api}
                            onChange={(e)=>{
                                localStorage.setItem('_api_url',e.target.value)
                                setApi(e.target.value)
                            }}
                        />
                    </Badge>
                </div>
            </div>
        </header>
    );
}

export default Header;