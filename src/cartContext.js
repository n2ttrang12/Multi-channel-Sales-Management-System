import React, { useContext, useEffect, useRef, useState } from 'react';
import { CartService } from 'services/cart';
import { keyToken } from 'variable';
import axios from 'axios';
import { useAuth } from 'global';
import { Message } from 'components';


const CartContext = React.createContext({
    cart: [],
    storeInfo: {},
    supplierInfo: {},
    addToCart: () => { },
    deleteCartItem: () => { },
    increaseQuantityCart: () => { },
    decreaseQuantityCart: () => { },
    toggleAmount: () => { },
    getCodeBar: () => { },

});

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [storeInfo, setStoreInfo] = useState({});
    const [supplierInfo, setSupplierInfo] = useState({});
    const { user } = useAuth();
    const timeout = useRef()


    const fetchListCart = async () => {
        const res = await CartService.getListCart();
        setCart(res?.data?.cartLineItem);

        setStoreInfo(res?.data?.userAdmin);
        setSupplierInfo(res?.data?.supplier);
    };
    useEffect(() => {
        const token = localStorage.getItem(keyToken);
        if (token && user?.userInfor?.roleCode === 'OWNER_STORE') {
            axios.defaults.headers.common.Authorization = 'Bearer ' + token;
            fetchListCart();
        }

    }, [user]);
    const addToCart = async (data) => {
        await CartService.addToCart(data);
        await fetchListCart();
        return data;
    };

    const deleteCartItem = async (id)   => {
        const tempCart = cart.filter((item) => item.productId !== id);
        await CartService.deleteCartItem(id)
            ;
        await fetchListCart();
        return setCart([...tempCart]);
    };

    const increaseQuantityCart = async (id) => {
        return await CartService.increaseQuantityCart(id)
            ;
    };
    const decreaseQuantityCart = (id) => {
        return CartService.decreaseQuantityCart(id)
            ;
    };
    const updateQuantityCart = (values) => {
        return CartService.updateQuantityCart(values);
    };

    const caculatePrice = (qty, data) => {
        if (!qty || !data || +qty === 0) return;
        if (+qty > 0) {
            const tempData = data.sort((a, b) => b.minQuantity - a.minQuantity);
            for (let i = 0; i < tempData.length; i++) {
                if (+qty >= tempData[i]?.minQuantity) {
                    return tempData[i]?.price;
                }
            }
        }
    };
    // const totalTaxPrice =
    //   arrayProductlist &&
    //   arrayProductlist
    //     .filter((item) => item.price !== undefined || item.quantity !== undefined)
    //     .reduce((a, c) => {
    //       if (
    //         (!c.basicUnit && pageType === 'edit' && (!c.price || !c.quantity)) ||
    //         (c.basicUnit && pageType === 'edit' && (!c.price || !c.quantityUnit))
    //       ) {
    //         return a;
    //       }
    //       return a + +c.price  (+c.quantityUnit || +c.quantity)  (+c?.tax / 100);
    //     }, 0);
    const toggleAmount = (data, type) => {
        const { id, updateAmount } = data;
        // const { id, value, updateAmount } = data;
        if (updateAmount > 999999) {
            Message.error({ text: 'Không đủ số lượng.' })
            // updateAmount = 9999999999999
            return 1;
        }
        if (updateAmount !== '' && +updateAmount > 0) {

            const tempOrder =
                cart &&
                cart.map((item) => {
                    if (item.productId === id) {
                        clearTimeout(timeout.current)
                        timeout.current = setTimeout(() => {
                            updateQuantityCart({ productId: item?.productId, quantity: +updateAmount });
                        }, 500);
                        return { ...item, quantity: updateAmount, price: item.product.productPrice ? caculatePrice(updateAmount, item.product.productPrice) : 0 };
                    }
                    return item;
                });
            return setCart([...tempOrder]);
        }
    };
    //   updateQuantityCart({ productId: item?.productId, quantity: +newAmount });
    //  return { ...item, quantity: +newAmount, price: caculatePrice(newAmount, item.product.productPrice) };
    // const toggleAmount = async (data) => {
    //   const { id, value, updateAmount } = data;
    //   const tempCart =
    //     cart &&
    //     cart.map((item) => {
    //       if (item.productId === id) {
    //         // if (value === 'inc') {
    //         //   let newAmount = +item.quantity + 1;
    //         //   if (newAmount > 9999999999999) {
    //         //     Message.error({ text: 'Không đủ số lượng.' })
    //         //     newAmount = 9999999999999
    //         //     return 1;
    //         //   }
    //         //   increaseQuantityCart(item?.productId)
    //         //   return { ...item, quantity: newAmount, price: caculatePrice(newAmount, item.product.productPrice) };
    //         // }
    //         // if (value === 'dec') {
    //         //   const newAmount = +item.quantity - 1;
    //         //   if (newAmount < 1) {
    //         //     return deleteCartItem(item?.productId);
    //         //   }

    //         //   decreaseQuantityCart(item?.productId);
    //         //   return { ...item, quantity: newAmount, price: caculatePrice(newAmount, item.product.productPrice) };

    //         // }
    //         if (value === 'update') {
    //           let newAmount;
    //           if (+updateAmount <= 0) {
    //             newAmount = 1;
    //           } else if (+updateAmount > 9999999999999) {
    //             Message.error({ text: 'Không đủ số lượng.' })
    //             newAmount = 9999999999999
    //           } else {
    //             newAmount = +updateAmount;
    //           }
    //           updateQuantityCart({ productId: item?.productId, quantity: +newAmount });
    //           return { ...item, quantity: +newAmount, price: caculatePrice(newAmount, item.product.productPrice) };
    //         }
    //       }
    //       return item;
    //     });
    //   await setCart([...tempCart]);
    //   setTimeout(() => {
    //     fetchListCart()
    //   }, [200])
    //   return tempCart;
    // };
    const getCodeBar = (data) => {
        const { id, _codeBar } = data
        const barCodeTemp = cart.map((item, index) => {
            if (item.productId === id) {
                return { ...item, storeBarcode: _codeBar }
            }
            return item
        })
        return setCart(barCodeTemp)
    }
    return (
        <CartContext.Provider
            value={{
                cart,
                storeInfo,
                supplierInfo,
                addToCart,
                deleteCartItem,
                increaseQuantityCart,
                toggleAmount,
                decreaseQuantityCart,
                fetchListCart,
                getCodeBar
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
// make sure use
export const useCart = () => {
    return useContext(CartContext);
};