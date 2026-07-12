import { useForm } from '@inertiajs/react';
import type { StoreOrderRequest } from '@/types';

export default function CreateOrderTest() {
    const { data, setData, post, errors, processing } = useForm<StoreOrderRequest>({
        staff_id: undefined,
        customer_id: undefined,
        notes: '',
        order_products: [],
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/dashboard/orders');
    };

    const addProduct = () => {
        setData('order_products', [
            ...data.order_products,
            { product_id: 0, quantity: 1, notes: '', modifiers: [] },
        ]);
    }

    const updateProduct = (index: number, field: keyof StoreOrderRequest['order_products'][number], value: any) => {
        const updatedProducts = [...data.order_products];
        updatedProducts[index] = { ...updatedProducts[index], [field]: value };
        setData('order_products', updatedProducts);
    }

    const removeProduct = (index: number) => {
        const updatedProducts = data.order_products.filter((_, i) => i !== index);
        setData('order_products', updatedProducts);
    }

    const addModifier = (productIndex: number) => {
        const updatedProducts = [...data.order_products];
        updatedProducts[productIndex].modifiers.push({ modifier_id: 0 });
        setData('order_products', updatedProducts);
    }

    const updateModifier = (productIndex: number, modifierIndex: number, value: any) => {
        const updatedProducts = [...data.order_products];
        updatedProducts[productIndex].modifiers[modifierIndex] = { modifier_id: value };
        setData('order_products', updatedProducts);
    }

    const removeModifier = (productIndex: number, modifierIndex: number) => {
        const updatedProducts = [...data.order_products];
        updatedProducts[productIndex].modifiers = updatedProducts[productIndex].modifiers.filter((_, i) => i !== modifierIndex);
        setData('order_products', updatedProducts);
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h2>🛒 Store Order - Backend Request Validation Test Page</h2>
            <hr />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                {/* Global Info */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Staff User ID (Required):</label>
                        <input
                            type="text"
                            value={data.staff_id}
                            onChange={e => setData('staff_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            placeholder="e.g., 1"
                        />
                        {errors.staff_id && <span style={{ color: 'red', fontSize: '13px' }}>{errors.staff_id}</span>}
                    </div>

                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontWeight: 'bold' }}>Customer User ID (Nullable):</label>
                        <input
                            type="text"
                            value={data.customer_id}
                            onChange={e => setData('customer_id', e.target.value)}
                            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                            placeholder="e.g., 2"
                        />
                        {errors.customer_id && <span style={{ color: 'red', fontSize: '13px' }}>{errors.customer_id}</span>}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Order General Notes (Max 255):</label>
                    <textarea
                        value={data.notes}
                        onChange={e => setData('notes', e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        placeholder="Optional general order details..."
                    />
                    {errors.notes && <span style={{ color: 'red', fontSize: '13px' }}>{errors.notes}</span>}
                </div>

                {/* Order Products Array Block */}
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>Products in Order</h3>
                        <button type="button" onClick={addProduct} style={{ padding: '5px 10px', marginLeft: 'auto', cursor: 'pointer' }}>
                            ➕ Add Product
                        </button>
                    </div>

                    {errors.order_products && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.order_products}</div>}

                    {data.order_products.map((product, pIdx) => (
                        <div key={pIdx} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: '#fff' }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>

                                <div style={{ flex: 2 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Product ID:</label>
                                    <input
                                        type="text"
                                        placeholder="Prod ID"
                                        value={product.product_id}
                                        onChange={e => updateProduct(pIdx, 'product_id', e.target.value)}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                    {errors[`order_products.${pIdx}.product_id` as keyof typeof errors] && (
                                        <span style={{ color: 'red', fontSize: '11px' }}>{errors[`order_products.${pIdx}.product_id` as keyof typeof errors]}</span>
                                    )}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Qty:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={e => updateProduct(pIdx, 'quantity', parseInt(e.target.value) || 1)}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                    {errors[`order_products.${pIdx}.quantity` as keyof typeof errors] && (
                                        <span style={{ color: 'red', fontSize: '11px' }}>{errors[`order_products.${pIdx}.quantity` as keyof typeof errors]}</span>
                                    )}
                                </div>

                                <div style={{ flex: 3 }}>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold' }}>Item Note:</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., No onions"
                                        value={product.notes}
                                        onChange={e => updateProduct(pIdx, 'notes', e.target.value)}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                    {errors[`order_products.${pIdx}.notes` as keyof typeof errors] && (
                                        <span style={{ color: 'red', fontSize: '11px' }}>{errors[`order_products.${pIdx}.notes` as keyof typeof errors]}</span>
                                    )}
                                </div>

                                <button type="button" onClick={() => removeProduct(pIdx)} style={{ color: 'red', marginTop: '20px', cursor: 'pointer' }}>
                                    Remove
                                </button>
                            </div>

                            {/* Nested Modifiers Block */}
                            <div style={{ marginLeft: '20px', padding: '8px', borderLeft: '2px solid #ddd' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Modifiers</span>
                                    <button type="button" onClick={() => addModifier(pIdx)} style={{ fontSize: '11px', padding: '2px 6px', cursor: 'pointer' }}>
                                        ➕ Add Modifier
                                    </button>
                                </div>

                                {product.modifiers.map((modifier, mIdx) => (
                                    <div key={mIdx} style={{ display: 'flex', gap: '5px', alignItems: 'center', marginBottom: '4px' }}>
                                        <input
                                            type="text"
                                            placeholder="Modifier ID"
                                            value={modifier.modifier_id}
                                            onChange={e => updateModifier(pIdx, mIdx, e.target.value)}
                                            style={{ padding: '3px', fontSize: '12px', width: '100px' }}
                                        />
                                        <button type="button" onClick={() => removeModifier(pIdx, mIdx)} style={{ color: 'red', fontSize: '11px', border: 'none', background: 'none', cursor: 'pointer' }}>
                                            ✕
                                        </button>
                                        {errors[`order_products.${pIdx}.modifiers.${mIdx}.modifier_id` as keyof typeof errors] && (
                                            <span style={{ color: 'red', fontSize: '11px' }}>
                                                {errors[`order_products.${pIdx}.modifiers.${mIdx}.modifier_id` as keyof typeof errors]}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>

                {/* Form Submission */}
                <button
                    type="submit"
                    disabled={processing}
                    style={{
                        padding: '12px',
                        backgroundColor: processing ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: processing ? 'not-allowed' : 'pointer'
                    }}
                >
                    {processing ? 'Submitting Test Payload...' : '🚀 Submit Order Payload'}
                </button>

            </form>

            {/* Debugging JSON Data Panel */}
            <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#333', color: '#fff', borderRadius: '5px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>📄 Sent Payload Preview Structure:</h4>
                <pre style={{ margin: 0, fontSize: '12px', overflowX: 'auto' }}>
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    );
}
