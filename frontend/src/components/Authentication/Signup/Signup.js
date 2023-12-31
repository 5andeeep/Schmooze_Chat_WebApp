import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom"

const Signup = () => {

    const [show, setShow] = useState(false); // to show password entered
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pics, setPics] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();


    // show password function
    const showPassword = () => setShow(!show);

    // post details (img)
    const postDetails = (pics) => {
        setLoading(true);
        // if we havent uploaded profile image..
        if (pics === undefined) {
            toast({
                title: 'Please upload image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        // if we have pic then we have to upload it on cloudinary website
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "mern-chat-app");
            data.append("cloud_name", "sandeepcoding");
            fetch("https://api.cloudinary.com/v1_1/sandeepcoding/image/upload", {
                method: "post",
                body: data,
            }).then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setPics(data.url.toString());
                    console.log(data.url.toString());
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
        }
        else {
            toast({
                title: 'Please upload image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }
    // submit form btn function
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            toast({
                title: 'Please fill all the details!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            toast({
                title: 'Passwords are not matching!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            };

            const { data } = await axios.post("/api/user", { name, email, password, pics }, config);
            toast({
                title: 'Registration Successful!',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem("userInfo", JSON.stringify(data));

            setLoading(false);
            navigate("/chat");
        }
        catch (err) {
            toast({
                title: 'Error Occured!',
                description: err.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
    }

    return (
        <VStack spacing={"5px"}>
            <FormControl id='first-name' isRequired mb={"1rem"}>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder='Enter your name'
                    type='text'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
            </FormControl>
            <FormControl id='email' isRequired mb={"1rem"}>
                <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter your email'
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </FormControl>
            <FormControl id='password' isRequired mb={"1rem"}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Enter your password'
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <InputRightElement width={"4.5rem"}>
                        <Button h={"1.7rem"} size={"sm"} onClick={showPassword}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='confirm-password' isRequired mb={"1rem"}>
                <FormLabel>Confirm password</FormLabel>
                <InputGroup>
                    <Input
                        placeholder='Confirm your password'
                        type={show ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                    {/* <InputRightElement width={"4.5rem"}>
                        <Button h={"1.7rem"} size={"sm"} onClick={showPassword}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement> */}
                </InputGroup>
            </FormControl>
            <FormControl id='profile-img'>
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type='file'
                    p={1.5}
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>
            <Button
                colorScheme='green'
                width={"100%"}
                mt={"20px"}
                onClick={submitHandler}
                isLoading={loading}
            >
                Sign up
            </Button>
        </VStack>
    )
}

export default Signup