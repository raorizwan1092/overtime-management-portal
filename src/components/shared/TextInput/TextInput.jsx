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
}) => {
    const theme = useTheme()

    return (
        <Form.Group className="mb-3" >
            <Form.Label >
                {label}
            </Form.Label>

            <Form.Control
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                isInvalid={touched && error}
                style={{ backgroundColor: theme.background, border: theme.border, color: theme.textColor }}
            />

            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default TextInput
