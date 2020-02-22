import React, { Component } from 'react';
import { Button } from 'antd';

class HomePage extends Component {
    render() {
        return (
            <div style={{ width: '100%', backgroundColor: '#FF8282' }}>
                <h2>Welcome to Invisible Ink</h2>
                <Button href="/register/student"> Register (Student)</Button>
                <Button href="register/admin"> Register (Admin) </Button>
            </div>
        );
    }
}

export default HomePage;
