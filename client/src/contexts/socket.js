import io from "socket.io-client";
import React from 'react';

const ip_address = '127.0.0.1';
const socket_port = '3001';

export const socket = io(ip_address + ':' + socket_port);
export const SocketContext = React.createContext();
