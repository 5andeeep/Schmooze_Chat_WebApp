import "./HomePageStyle.css";
import React, { useEffect } from 'react';
import { Container, Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import Login from '../../components/Authentication/Login/Login';
import Signup from '../../components/Authentication/Signup/Signup';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {

    const navigate = useNavigate();

    useEffect(() => {
        // we are setting up localStorage.setItem in login and signup components
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) {
            navigate("/");
        }
    }, [navigate])

    return (
        <Container maxW={"xl"} centerContent>
            <Box
                className='login_signup_window'
            >
                <Box
                    className="chatApp-Text-Box"
                >
                    <Text fontSize={"4xl"}>Schmooze App</Text>
                </Box>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList mb={"1em"}>
                        <Tab width={"50%"}>Login</Tab>
                        <Tab width={"50%"}>Signup</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default HomePage