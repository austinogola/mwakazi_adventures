import React from "react";
import "../styles/voucherCard.css";

const VoucherCard = ({ amount, voucherCode, expiry, voucherNumber }) => {
  return (
    <div className="voucher-card">
      <div className="voucher-top">
        <div className="voucher-left">
          <h1>GIFT VOUCHER</h1>
          <p>Lorem Ipsum is not simply random text.</p>
          <p className="voucher-code">
            No.
            <br /> {voucherNumber}
          </p>
          <p className="voucher-code">
            Code.
            <br /> {voucherCode}
          </p>
        </div>
        <div className="voucher-right">
          <h3>VALUE</h3>
          <h1>${amount}</h1>
          <p>
            Lorem Ipsum is not simply random text. It has roots in classical
            Latin literature.
          </p>
        </div>
      </div>
      <div className="voucher-bottom">
        <div className="voucher-conditions">
          <h4>CONDITIONS</h4>
          <p>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in classical Latin literature.
          </p>
          <p className="voucher-expiry">Expiry Date: {expiry}</p>
        </div>
        <div className="voucher-contact">
          <p>Name: </p>
          <p>Email: </p>
        </div>
      </div>
    </div>
  );
};

export default VoucherCard;
