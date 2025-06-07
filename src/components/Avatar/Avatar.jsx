import React from 'react';
import defaultAvatar from './ec788be12bf7cbea0e8e0ac709ec6af74b5bc3fa.png';
import style from './Avatar.module.css';

const Avatar = ({ src, alt = 'avatar', className = '' }) => {
  const badUrls = ['https://static.productionready.io/images/smiley-cyrus.jpg'];

  const isValidSrc =
    typeof src === 'string' &&
    src.trim() !== '' &&
    src !== 'null' &&
    (src.startsWith('http://') || src.startsWith('https://')) &&
    !badUrls.includes(src);

  return (
    <img
      src={isValidSrc ? src : defaultAvatar}
      alt={alt}
      className={`${style.avatar} ${className}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = defaultAvatar;
      }}
    />
  );
};

export default Avatar;
