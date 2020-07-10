import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios'
import './home.css'
import NotificationIcon from '@material-ui/icons/Notifications'
import socketIOClient from "socket.io-client";
import Badge from '@material-ui/core/Badge';

const ENDPOINT = "http://localhost:5000";


export default function Home() {
    const [searchKey, setSearch] = useState('');
    const [response, setResponse] = useState([]);
    const [socket, setSocket] = useState('')

    const prevCountRef = useRef();

    useEffect(() => {
        let socket = socketIOClient(ENDPOINT);
        setSocket(socket)
        
        console.log(response.length)
        socket.on("tweets", data => {
            setResponse(res => {
                
                return res.length < 125 ? res.concat(data) : res
            })
        });
    }, []);

    const handleChange = (e) => {
        let { value } = e.target
        setSearch(value)
    }

    const notification = (e) => {
        console.log(response)
        console.log(response.length)
    }
    const search = () => {
        console.log(searchKey)
        socket.emit('tweet', searchKey)
        setResponse([])
    }

   const more = () =>{
       setResponse(res => res.slice(25))
   }
    return (<>
        <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-3">
                <input type="text" className="form-control" onChange={handleChange} />

            </div>
            <div className="col-md-2">
                <button className="btn btn-outline-primary btn-block" onClick={search}>Search</button>
            </div>
            <div className="col-md-1">
                <Badge badgeContent={response.length > 25 ? response.length -25 : 0} color="error">
                    <NotificationIcon style={{ color: '#fff', marginTop: '6px' }} onClick={notification} />
                </Badge>
            </div>
            <div className="col-md-3"></div>
        </div>
        {response.length > 25 ?
        <div className="text-center" style={{paddingTop : '20px'}}>
            <button className="btn btn-outline-secondary" onClick={more}>Show More</button>
        </div> : null}
        <div>
            {response.map((tweet, i) => (
                <>
                    {i < 25 ?
                        <div className="row" style={{ paddingTop: '20px' }} key={tweet.id}>
                            <div className="col-md-3"></div>
                            <div className="col-md-6">
                                <div>
                                    <div className="card">
                                        <div className="card-body t-tweet">
                                            <div className="user-img-container">
                                                <img src={tweet.user.profile_image_url} className="user-img" />
                                            </div>
                                            <div className="t-desc">
                                                <div className="t-user-info">
                                                    <p style={{ marginBottom: '5px' }}><b>{tweet.user.name}</b>&ensp;
                                                <span style={{ color: 'rgb(136, 153, 166)' }}>
                                                            @{tweet.user.screen_name} - <small>{tweet.created_at}</small>
                                                        </span></p>

                                                    <p style={{ fontSize: '14px' }}>
                                                        {tweet.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3"></div>
                        </div> : null}
                </>
            ))}
        </div>
    </>)

}
