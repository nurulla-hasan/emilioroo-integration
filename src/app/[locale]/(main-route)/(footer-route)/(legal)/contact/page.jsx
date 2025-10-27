"use client";
import React, { useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AtSign, Feather, Mail, Phone, User } from "lucide-react";
import Title from '@/components/ui/Title';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        // console.log({ name, email, subject, message });
        // alert('Message sent! (Check console for details)');
        // Clear form fields
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    };

    return (
        <div className="min-h-minus-header">
            <PageLayout>
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <Title>Lets Connect!</Title>
                        <p className="text-sm text-muted-foreground max-w-3xl mx-auto font-light">
                            We’re always here to listen. Share your thoughts, ask a question, or simply say hello.
                        </p>
                    </div>

                    {/* Contact Info & Form Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-[1000px] mx-auto">
                        {/* Contact Info Cards */}
                        <div className="md:col-span-1 flex flex-col gap-6">
                            <Card className="flex flex-col items-center p-6 text-center transition-transform transform hover:scale-105 bg-card shadow-xl border-t-4 border-primary">
                                <Mail className="h-12 w-12 text-primary mb-2" />
                                <p className="text-xl font-semibold text-foreground p-0 mb-4">Email Us</p>
                                <CardContent className="text-muted-foreground p-0">
                                    <p className="text-lg">hello@example.com</p>
                                    <p className="text-lg">support@example.com</p>
                                </CardContent>
                            </Card>

                            <Card className="flex flex-col items-center p-6 text-center transition-transform transform hover:scale-105 bg-card shadow-xl border-t-4 border-primary">
                                <Phone className="h-12 w-12 text-primary mb-2" />
                                <p className="text-xl font-semibold text-foreground p-0 mb-4">Call Us</p>
                                <CardContent className="text-muted-foreground p-0">
                                    <p className="text-lg">(+1) 888-750-6866</p>
                                    <p className="text-lg">(+1) 888-785-3986</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Form */}
                        <Card className="md:col-span-1 p-8 shadow-2xl bg-card/70 backdrop-blur-sm">
                            <CardHeader className="text-2xl font-bold text-foreground text-center mb-6 p-0">Send us a Message</CardHeader>
                            <CardContent className="p-0">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <div className="relative mt-1">
                                            <Input id="name" placeholder="Your Name" className="pl-10" value={name} onChange={(e) => setName(e.target.value)} />
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative mt-1">
                                            <Input id="email" type="email" placeholder="your@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                                            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="subject">Subject</Label>
                                        <div className="relative mt-1">
                                            <Input id="subject" placeholder="Subject of your message" className="pl-10" value={subject} onChange={(e) => setSubject(e.target.value)} />
                                            <Feather className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" placeholder="Your message here..." rows="5" className="mt-1" value={message} onChange={(e) => setMessage(e.target.value)} />
                                    </div>
                                    <Button type="submit" className="w-full text-md">Send Message</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </PageLayout>
        </div>
    );
};

export default Contact;