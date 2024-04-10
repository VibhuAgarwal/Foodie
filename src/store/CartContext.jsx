import { createContext, useReducer } from "react"

const CartContext = createContext({
    items: [],
    addItem: (item) => { },
    removeItem: (id) => { },
});

function cartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        const existingCartItemIdx = state.items.findIndex((item) => item.id === action.item.id);
        const updatedItems = [...state.items];

        if (existingCartItemIdx > -1) {
            const existingItem = state.items[existingCartItemIdx];
            const updatedItem = {
                ...existingItem,
                quantity: state.items[existingCartItemIdx].quantity + 1
            };
            updatedItems[existingCartItemIdx] = updatedItem;
        } else {
            updatedItems.push({ ...action.item, quantity: 1 });
        }
        return { ...state, items: updatedItems };
    }
    if (action.type === 'REMOVE_ITEM') {
        const existingCartItemIdx = state.items.findIndex((item) => item.id === action.id);
        const existingCartItem = state.items[existingCartItemIdx];

        const updatedItems = [...state.items];
        if (existingCartItem.quantity > 1) {
            updatedItems.slice(existingCartItemIdx, 1)
        } else {
            const updatedItems = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1,
            };
            updatedItems[existingCartItemIdx] = updatedItems;
        }
        return { ...state, items: updatedItems };
    }
    return state;
}

export function CartContextProvider({ children }) {
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });
    function addItem(item) {
        dispatchCartAction({ type: 'ADD_ITEM', item: item })
    }

    function removeItem(id) {
        dispatchCartAction({ type: 'REMOVE_ITEM', id: id })
    }

    const cartContext = {
        items: cart.items,
        addItem,
        removeItem,
    };

    console.log(cartContext);

    return (
        <CartContext.Provider value={cartContext}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext;