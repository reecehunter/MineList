import React from 'react'
import styles from './Tag.module.css'
import Hash from '../icons/Hash'

const Tag = (props) => {
    const { name } = props;

    return (
        <span className={`${styles.contents}`}>
            <Hash color="var(--secondaryColor)" /> {name}
        </span>
    )
}

export default Tag