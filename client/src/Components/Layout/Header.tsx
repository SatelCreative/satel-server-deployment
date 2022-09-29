import React from 'react';

interface Props {
  /**
   * Defines if the header is visible
   */
  show?: boolean;

  /**
   * Page title
   */
  title: string;

  /**
   * Company logo
   */
  logo: string;

  /**
   * Name of the company
   */
  companyName: string;
}

function Header({ title, logo, companyName, show = true }: Props) {
  if (!show) {
    return null;
  }

  return (
    <div className="Polaris-Page Polaris-Page--fullWidth">
      <div className="Polaris-Page__Content" style={{ marginBottom: 0 }}>
        <div className="HeaderElements">
          <ul>
            <li>
              <div className="backgroundLogo">
                <img src={logo} alt="Logo" className="logo" />
              </div>
            </li>
            <li>
              <h1>{title}</h1>
            </li>
            <li>
              <h2>{companyName}</h2>
            </li>
          </ul>
          <br />
        </div>
      </div>
    </div>
  );
}

export default Header;
