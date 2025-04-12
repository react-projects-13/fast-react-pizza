import { Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant.js';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';
import { clearItem, getCart } from '../cart/cartSlice';
import EmptyCart from "../cart/EmptyCart"
import store from "../../store.js"
import { useDispatch } from 'react-redux';
import { fetchAddress } from '../user/userSlice.js';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

const parentItem = 'gam-2 mb-5 flex flex-col gap-2 sm:flex-row sm:items-center';

const labelItem = 'sm:basis-40';

function CreateOrder() {
  const {
    username,
    status: addresStauts,
    position,
    address,
    error: errorAddress
  } = useSelector(state => state.user)
  const isLoadingAddress = addresStauts === "loading"

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formErrors = useActionData();
  const dispatch = useDispatch()

  const cart = useSelector(getCart)

  if (!cart.length) return <EmptyCart />

  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let's go!</h2>

      {/* <Form method="POST" action="/order/new"> */}
      <Form method="POST">
        <div className={parentItem}>
          <label className={labelItem}>First Name</label>
          <input className="input grow" type="text" name="customer" defaultValue={username} required />
        </div>

        <div className={parentItem}>
          <label className={labelItem}>Phone number</label>
          <div className="grow">
            <input className="input w-full" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && (
            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {formErrors.phone}
            </p>
          )}
        </div>

        <div className={parentItem + " relative"}>
          <label className={labelItem}>Address</label>
          <div className="grow">
            <input
              className="input w-full"
              type="text"
              name="address"
              disabled={isLoadingAddress}
              defaultValue={address}
              required
            />

            {addresStauts == "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {errorAddress}
              </p>
            )}

            {!position.latitude && !position.longitude && <span className='absolute right-1 bottom-[3px] sm:top-3 sm:right-4 md:top-2'>
              <Button disabled={isSubmitting || isLoadingAddress} type="small" onClick={(e) => {
                e.preventDefault()
                dispatch(fetchAddress())
              }}>Get Address</Button>
            </span>}
          </div>



        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
          // value={withPriority}
          // onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label className="font-medium" htmlFor="priority">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input type="hidden" name='position' value={position.latitude && position.longitude ? `${position.latitude}, ${position.longitude}` : ""} />
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Placing order...' : 'Order now'}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {

  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'on',
  };

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might ned it to contact you.';

  if (!Object.keys(errors.length > 0)) return errors


  // If everything  is okay, create new order and redirect

  store.dispatch(clearItem())

  const newOrder = await createOrder(order);
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
