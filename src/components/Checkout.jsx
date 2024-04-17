import { useContext } from "react"
import Modal from "./UI/Modal"
import CartContext from "../store/CartContext"
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";

const requestConfig = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
};

export default function checkout() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp('https://hungrier.onrender.com/orders', requestConfig);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price,
        0
    );

    function handleClose() {
        userProgressCtx.hideCheckout();
    }

    function handleFinish() {
        userProgressCtx.hideCart();
        cartCtx.clearCart();
        clearData();
    }

    function handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.target);
        const customerData = Object.fromEntries(fd.entries());

        sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData,
            }
        }));
    }

    let actions = (
        <>
            <Button type='button' textOnly onClick={handleClose}>
                Close
            </Button>
            <Button>Confirm Order</Button>
        </>
    );

    if (isSending) {
        actions = <span>Sending Order Data</span>
    }

    if (data && !error) {
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>Success</h2>
            <p>Thank you for your order. You will receive an email with your order details.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total amount : {currencyFormatter.format(cartTotal)} </p>
            <Input label='Full Name' type='text' id='name' />
            <Input label='Email address' type='email' id='email' />
            <Input label='Street' type='text' id='street' />
            <div className="control-row">
                <Input label='Postal code' type='text' id='postal-code' />
                <Input label='City' type='text' id='city' />
            </div>

            {error && <Error title='Failed to Submit' message={error} />}
            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}