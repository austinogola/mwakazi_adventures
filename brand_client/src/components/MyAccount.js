import React from 'react';
import { FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';

const MyAccount = () => {
  return (
    <div style={styles.myAccount}>
      {/* <FiUser /> */}
      <Link to='/dashboard'>
      <div style={styles.textContainer}>
        <span style={styles.accountText}>My Account</span>
        {/* <span style={styles.loginText}>LOG IN</span> */}
      </div>
      </Link>
    </div>
  );
};

const styles = {
  myAccount: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#3b3e40',  // Dark grey background
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    color: '#ffffff',
  },
  icon: {
    fontSize: '30px',
    marginRight: '10px',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  accountText: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '4px',
  },
  loginText: {
    fontSize: '12px',
    color: '#d3d3d3',  // Light grey color for the "LOG IN" text
  },
};

export default MyAccount;
