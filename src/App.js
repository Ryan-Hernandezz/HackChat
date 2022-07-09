import './App.css';
// eslint-disable-next-line no-unused-vars
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { useState, useRef } from 'react';

firebase.initializeApp({
  apiKey: "AIzaSyATKnkcAj2hUnS5d9tmWsfUiJGyl-lP_To",
  authDomain: "hackchat-3eb66.firebaseapp.com",
  projectId: "hackchat-3eb66",
  storageBucket: "hackchat-3eb66.appspot.com",
  messagingSenderId: "501445748153",
  appId: "1:501445748153:web:781c596df4212aba5d4268",
  measurementId: "G-JM6VLXMXQ1"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function SignIn() {
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle} className='sign-in'>
        Sign In With Google
    </button>
  )
}


function SignOut() {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>
      Sign Out
    </button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'});
  }

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </div>
      <form onSubmit={sendMessage} >
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder='Send Message...' />
        <button type='submit' disabled={!formValue}>💬</button>
      </form>
    </>
  )
}


function ChatMessage(props) {
  const {text, uid} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messageClass}`}>
      <img src={'https://cdn2.iconfinder.com/data/icons/social-flat-buttons-3/512/anonymous-512.png'} alt='' />
      <p>{text}</p>
    </div>
  )
}


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className='head'>
        <h1>HackChat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn /> }
      </section>
    </div>
  );
}

export default App;