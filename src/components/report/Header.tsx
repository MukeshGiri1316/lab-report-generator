import React from 'react'
import Image from "next/image";


function Header() {
  return (
    <div>
      {/* ====== Hospital Header ====== */}
      <div className="report-header">
        <Image
          className="report-header-img"
          src="/report-images/image1.jpeg"
          alt="Vyas Superspeciality Hospital Header"
          width={1129}
          height={256}
          priority
        />
      </div>
    </div>
  )
}

export default Header