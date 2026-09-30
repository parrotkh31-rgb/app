import React from "react";
import './menu.css';
function Menu({ name, onLogout }) {
  return (
    <div>
    <main>
        <h1>Hello! {name}</h1>
        <button className="btn1" type="button" onClick={onLogout}>Log out</button>
    </main>

    <button class="save-btn">
            <div class="save-svg-wrapper-1">
                <div class="save-icon-box">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                    class="save-icon"
                        >
                    <path
                    d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37 8.2 8.94 8.43 9.37 8.8C10.14 7.05 11.13 5.44 13.91 5.44C17.28 5.44 18.87 8.06 18.87 10.83C18.87 10.94 18.87 11.06 18.86 11.17C20.65 11.54 22 13.13 22 15.04Z"
                    ></path>
                </svg>
                </div>
            </div>

            <span class="save-text">Save</span>
        </button>

    <button class="game-play-btn">
    To do 📝

    <div id="gamePlayFrame">
            <div id="gameCornerTL" class="game-corner"></div>
            <div id="gameCornerBR" class="game-corner"></div>
            <div id="gameCornerTR" class="game-corner"></div>
            <div id="gameCornerBL" class="game-corner"></div>
    </div>

            <span id="gameArrowRight" class="game-arrow"></span>
            <span id="gameArrowLeft" class="game-arrow"></span>
        </button>

    <button class="edit-action-btn">
    Edit
    <svg class="edit-action-icon" viewBox="0 0 512 512">
        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
        </svg>
    </button>
    
            <button class="sparkle-action-btn">
        Delited Notes📝

        <div class="sparkle-item-one">
            <svg viewBox="0 0 784.11 815.53">
            <path
                class="sparkle-shape"
                d="M392.05 0c-20.9 210.08-184.06 378.41-392.05 407.78 207.96 29.37 371.12 197.68 392.05 407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z">
            </path>
            </svg>
        </div>

        <div class="sparkle-item-two">
            <svg viewBox="0 0 784.11 815.53">
            <path
                class="sparkle-shape"
                d="M392.05 0c-20.9 210.08-184.06 378.41-392.05 407.78 207.96 29.37 371.12 197.68 392.05 407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z">
            </path>
            </svg>
        </div>

        <div class="sparkle-item-three">
            <svg viewBox="0 0 784.11 815.53">
            <path
                class="sparkle-shape"
                d="M392.05 0c-20.9 210.08-184.06 378.41-392.05 407.78 207.96 29.37 371.12 197.68 392.05 407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z">
            </path>
            </svg>
        </div>

        <div class="sparkle-item-four">
            <svg viewBox="0 0 784.11 815.53">
            <path
                class="sparkle-shape"
                d="M392.05 0c-20.9 210.08-184.06 378.41-392.05 407.78 207.96 29.37 371.12 197.68 392.05 407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z">
            </path>
            </svg>
        </div>

        <div class="sparkle-item-five">
            <svg viewBox="0 0 784.11 815.53">
            <path
                class="sparkle-shape"
                d="M392.05 0c-20.9 210.08-184.06 378.41-392.05 407.78 207.96 29.37 371.12 197.68 392.05 407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z">
            </path>
            </svg>
        </div>

        <div class="sparkle-item-six">
            <svg viewBox="0 0 784.11 815.53">
            <path
                class="sparkle-shape"
                d="M392.05 0c-20.9 210.08-184.06 378.41-392.05 407.78 207.96 29.37 371.12 197.68 392.05 407.74 20.93-210.06 184.09-378.37 392.05-407.74-207.98-29.38-371.16-197.69-392.06-407.78z">
            </path>
            </svg>
        </div>
        </button>


                <button class="payment-action-btn">
        <span class="payment-action-text">Finished Jobs</span>

        <div class="payment-icon-box">

                <svg viewBox="0 0 24 24" class="payment-action-icon payment-card-icon">
                <path
                    d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18C2,19.11 2.89,20 4,20H20C21.11,20 22,19.11 22,18V6C22,4.89 21.11,4 20,4Z"
                    fill="currentColor"
                ></path>
                </svg>

                <svg viewBox="0 0 24 24" class="payment-action-icon payment-money-icon">
                <path
                    d="M2,17H22V21H2V17M6.25,7H9V6H6V3H18V6H15V7H17.75L19,17H5L6.25,7M9,10H15V8H9V10M9,13H15V11H9V13Z"
                    fill="currentColor"
                ></path>
                </svg>

                <svg viewBox="0 0 24 24" class="payment-action-icon payment-dollar-icon">
                <path
                    d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
                    fill="currentColor"
                ></path>
                </svg>

                <svg viewBox="0 0 24 24" class="payment-action-icon payment-wallet-icon payment-default-icon">
                <path
                    d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
                    fill="currentColor"
                ></path>
                </svg>

                <svg viewBox="0 0 24 24" class="payment-action-icon payment-check-icon">
                <path
                    d="M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z"
                    fill="currentColor"
                ></path>
                </svg>

            </div>

        </button>




    </div>
  );
}

export default Menu;