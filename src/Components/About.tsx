import React from 'react';
import { Container } from '@mantine/core';
import Talks from './Talks/Talks';
import { DEFAULT_TALK_COLORS } from './Talks/constants';

const About = () => {
    return (
        <section id="about">
            <Container fluid style={{ width: '100%' }}>
                <Talks talkColors={DEFAULT_TALK_COLORS} />
            </Container>
        </section>
    );
};

export default About;