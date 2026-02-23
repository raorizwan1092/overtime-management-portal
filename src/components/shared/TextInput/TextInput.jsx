import { useTheme } from '@/contexts/ThemeContext'
import React from 'react'
import { Form } from 'react-bootstrap'

const TextInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    touched,
    disabled= false
}) => {
    const theme = useTheme()

    return (
        <Form.Group className="mb-3 text-start" >
            <Form.Label style={{color:theme?.textColor}}>
                {label}
            </Form.Label>

            <Form.Control
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                isInvalid={touched && error}
                disabled={disabled}
                style={{ backgroundColor: disabled ? '#232323' : theme.background, border: theme.border, color: theme.textColor }}
            />

            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default TextInput
