import { Card, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import React, { useState } from 'react'
import OrderTable from './OrderTable'

const orderStatus = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
    { label: "Delivered", value: "DELIVERED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" }
]

export default function Orders() {
    const [filterValue, setFilterValue] = useState("ALL")

    const handleFilter = (e) => {
        setFilterValue(e.target.value)
    }

    return (
        <div className='px-2'>
            <Card className='p-5'>
                <Typography sx={{ paddingBottom: '1rem' }} variant='h5'>
                    Order Status
                </Typography>
                <FormControl>
                    <RadioGroup onChange={handleFilter} row name='order_status' value={filterValue}>
                        {orderStatus.map((item) => (
                            <FormControlLabel
                                key={item.value}
                                value={item.value}
                                control={<Radio />}
                                label={item.label}
                                sx={{ color: 'gray' }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Card>
            <OrderTable filterValue={filterValue} />
        </div>
    )
}
