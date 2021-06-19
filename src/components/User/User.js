import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './User.css';

var baseUrl = 'http://localhost:3002/';


class User extends Component {

    state = {
        userRecords: [],
        load: 5,
        useid: '',
        name: '',
        email: '',
        phone: '',
        gender: '',
        education: '',
        hobby: [],
        experience: '',
        pic: '',
        message: '',
        hobbies: {
            cricket: false,
            singing: false,
            travelling: false
        },
        errName: '',
        errEmail: '',
        errPhone: '',

    }
    componentDidMount() {
        axios.get(baseUrl + 'getUsers/' + this.state.load).then(response => response.data.data).then(
            (result) => {
                this.setState({
                    userRecords: result
                });
            },
            (error) => {
                this.setState({ error });
            }
        )
    }

    allUsers = () => {

    }


    loadMore = () => {
        this.setState(prevState => ({
            load: prevState.load + 5
        }), () => {
            this.componentDidMount()
        });
    }



    mySubmitHandler = (event) => {



        event.preventDefault();
        let formData = new FormData();
        formData.append('name', this.state.name);
        formData.append('email', this.state.email);
        formData.append('phone', this.state.phone);
        formData.append('gender', this.state.gender);
        formData.append('education', this.state.education);
        formData.append('hobby', this.state.hobby);
        formData.append('experience', this.state.experience);
        formData.append('pic', this.state.pic);
        formData.append('message', this.state.message);

        let validname = /^[a-zA-Z]+$/
        var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        let validPhone = /^((\\+91-?)|0)?[0-9]{10}$/

        if (validname.test(this.state.name)) {
            this.setState({ errName: '' })
            if (reg.test(this.state.email)) {
                this.setState({ errEmail: '' })
                if (validPhone.test(this.state.phone)) {
                    this.setState({ errPhone: '' })
                    //mesg.innerHTML = "";  
                    //return true;  


                    const config = {
                        headers: { 'content-type': 'multipart/form-data' }
                    }
                    const postUrl = 'http://localhost:3002/imageUpload';
                    axios.post(postUrl, formData, config)
                        .then(response => {
                            this.componentDidMount();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    this.setState({ errPhone: 'enter valid phone number' })
                }
            } else {
                this.setState({ errEmail: 'enter valid email' })
            }
        } else {
            this.setState({ errName: 'enter valid name' })
        }
    }
    handleChange = (event) => {
        var isChecked = event.target.checked;
        var item = event.target.value;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    }

    onChange = (e) => {

        if (e.target.name === 'name') {
            this.setState({ name: e.target.value });
           
        } else if (e.target.name === 'email') {
            this.setState({ email: e.target.value });
           
        } else if (e.target.name === 'phone') {
            this.setState({ phone: e.target.value });
           
        } else if (e.target.name === 'gender') {
            this.setState({ gender: e.target.value });
           
        } else if (e.target.name === 'education') {
            this.setState({ education: e.target.value });
           
        }
        else if (e.target.id === 'hobby') {
            var { name, checked } = e.target;
            this.setState((e) => {
                var selected = e.hobbies;
                return selected[name] = checked;
            }, () => {
                let storedHobby = Object.keys(this.state.hobbies).filter((x) => this.state.hobbies[x])
                
                this.setState({ hobby: storedHobby })
            })
        }
        else if (e.target.name === 'experience') {
            this.setState({ experience: e.target.value });
            
        }
        else if (e.target.name === 'pic') {
            
            this.setState({ pic: e.target.files[0] });
            
        }
        else if (e.target.name === 'message') {
            this.setState({ message: e.target.value });
           
        }
    }


    RemoveUser = (id) => {
      
        axios.delete(baseUrl + 'user/' + id)
            .then(res => {
               
                this.componentDidMount()
            })
    }

    updateUser = (id) => {
        axios.get(baseUrl + 'getUser/' + id).then(response => response.data.data).then(
            (result) => {
                let user = result

                this.setState({ userid: user[0].userid })
                this.setState({ name: user[0].name })
                this.setState({ email: user[0].email })
                this.setState({ phone: user[0].phone })
                this.setState({ experience: user[0].experience })
                this.setState({ message: user[0].message })
                this.setState({ education: user[0].education })
            },
            (error) => {
                this.setState({ error });
            }
        )
    }

    updateSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('name', this.state.name);
        formData.append('email', this.state.email);
        formData.append('phone', this.state.phone);
        formData.append('gender', this.state.gender);
        formData.append('education', this.state.education);
        formData.append('experience', this.state.experience);
        formData.append('message', this.state.message);

        let reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (reg.test(this.state.email)) {
            //mesg.innerHTML = "";  
            //return true; 
            const config = {
                headers: { 'content-type': 'multipart/form-data' }
            }
            const postUrl = 'http://localhost:3002/updatUser/' + this.state.userid;
            axios.put(postUrl, formData, config)
                .then(response => {
                   
                    this.componentDidMount()
                })
                .catch(error => {
                    console.log(error);
                });

        } else {
            this.setState({ errMsg: 'Please check email' }, () => {
                console.log(this.state.errMsg)
            })

        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.mySubmitHandler}>
                    <div>
                        <span> Name : </span> <input
                            type='text' name='name'
                            value={this.state.name}
                            onChange={this.onChange}
                        />
                        <span>{
                            this.state.errName !== '' && <span style={{ color: '#ff0000' }}> {this.state.errName} </span>
                        }</span>
                    </div>
                    <div>
                        <span> Email : </span> <input name='email'
                            value={this.state.email}
                            type='text'
                            onChange={this.onChange}
                        />
                        <span>{
                            this.state.errEmail !== '' && <span style={{ color: '#ff0000' }}> {this.state.errMsg} </span>
                        }</span>
                    </div>
                    <div>
                        <span>Phone :</span> <input name='phone'
                            type='text'
                            value={this.state.phone}
                            onChange={this.onChange}
                        />
                        <span>{
                            this.state.errPhone !== '' && <span style={{ color: '#ff0000' }}> {this.state.errPhone} </span>
                        }</span>
                    </div>

                    <div>
                        <span>  Gender :</span> <input type="radio" value="Male" name="gender" onChange={this.onChange} /> Male
                        <input type="radio" value="Female" name="gender" onChange={this.onChange} /> Female
                    </div>
                    <div>
                        <span>Education : </span><select name='education' value={this.state.education} onChange={this.onChange}>
                            <option value="none" selected disabled hidden> Select </option>
                            <option value="MCA">MCA</option>
                            <option value="BCA">BCA</option>
                            <option value="MSIT">MSIT</option>
                        </select>
                    </div>
                    <div>
                        Hobby :
                        <input type="checkbox" id='hobby' name='Cricket' onChange={this.onChange} /> Cricket  &nbsp;&nbsp;
                        <input type="checkbox" id='hobby' name='Singing' onChange={this.onChange} /> Singing  &nbsp;&nbsp;
                        <input type="checkbox" id='hobby' name='Travelling' onChange={this.onChange} /> Travelling
                    </div>
                    <div>
                        Experience : <input name="experience"
                            type='text'
                            value={this.state.experience}
                            onChange={this.onChange} 
                        />
                    </div>
                    <div>
                        Picture : <input type="file" style={{margin:'5px'}} name='pic'  onChange={this.onChange} />

                    </div>
                    <div>
                        Message : <textarea name='message'
                            type='text'
                            style={{margin:'5px'}}
                            value={this.state.message}
                            onChange={this.onChange}
                        />
                    </div>

                    {/* <input type="submit" /> */}
                    <button style={{margin:'10px'}}> Submit </button>
                    {/* <button name="update"> Update </button> */}
                    <button name="update" onClick={this.updateSubmit}> Update </button>
                </form>


                <table style={{ width: '100%' }}>
                    <tr>
                        <th>Sr No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Hobby</th>
                        <th>Picture</th>
                        <th>Action</th>
                    </tr>

                    {
                        this.state.userRecords.map((users) => {
                            return <tr key={users.userid}>
                                <td>{users.userid}</td>
                                <td>{users.name}</td>
                                <td>{users.email}</td>
                                <td>{users.hobby}</td>
                                <td> <img style={{ height: '20vmin' }} src={`${baseUrl}${users.pic}`}></img>  </td>
                                <td> <button onClick={() => this.updateUser(users.userid)} >Edit</button> | <button onClick={() => this.RemoveUser(users.userid)}>Delete</button> </td>
                            </tr>
                        })

                    }
                </table>
                <button onClick={this.loadMore} style={{margin:'10px'}} >Load More</button>
            </div>
        );
    }
}

User.propTypes = {

};

export default User;