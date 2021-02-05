import React from "react";
import ReactNextPaging from "react-next-paging";
import styled from 'styled-components';
import PropTypes from "prop-types";

import Widget from '../Widget';
import Link from '../Link';

const ButtonStyles = styled.button`
    border: 1px solid #ccc;
    border-radius: 2px;
    background: #ddd;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 18px;
    padding: 3px 6px;
    transition: .3s;
    cursor: pointer;
    &:hover,
    &:focus {
      opacity: .5;
    }
`;

export default function Paging ({ itemsperpage, nocolumns, items, pagesspan }) {
  return (
    <ReactNextPaging
      itemsperpage={itemsperpage}
      nocolumns={nocolumns}
      items={items}
      pagesspan={pagesspan}
    >
      {({
        getBackButtonProps,
        getFastBackButtonProps,
        getFwdButtonProps,
        getFastFwdButtonProps,
        getSelPageButtonProps,
        nopages,
        inipagearray,
        pagesforarray,
        currentpage,
        noitems,
        initialitem,
        lastitem,
        goBackBdisabled,
        goFastBackBdisabled,
        goFwdBdisabled,
        goFastFwdBdisabled
      }) => (
        <tbody>
          <ul>
          {items.slice(initialitem, lastitem).map((linkExterno) => {
              const [projectName, githubUser] = linkExterno
                .replace(/\//g, '')
                .replace('https:', '')
                .replace('.vercel.app', '')
                .split('.');

              return (
                <li key={linkExterno}>
                  <Widget.Topic
                    as={Link}
                    href={`/quiz/${projectName}___${githubUser}`}
                  >
                    {`${githubUser}/${projectName}`}
                  </Widget.Topic>
                </li>
              );
            })}
          </ul>
            
          
          {/* {items.slice(initialitem, lastitem).map((item, index) => {
            return item;
          })} */}
          {noitems > 0
            ? [
                <tr key={"pagingrow" + 100}>
                  <td colSpan={nocolumns} style={{ textAlign: "center" }}>
                    <ButtonStyles
                      {...getFastBackButtonProps()}
                      disabled={goFastBackBdisabled}
                    >
                      {"<<"}
                    </ButtonStyles>
                    <ButtonStyles
                      {...getBackButtonProps()}
                      disabled={goBackBdisabled}
                    >
                      {"<"}
                    </ButtonStyles>
                    {Array.from(
                      { length: pagesforarray },
                      (v, i) => i + inipagearray
                    ).map(page => {
                      return (
                        <ButtonStyles
                          key={page}
                          {...getSelPageButtonProps({ page: page })}
                          disabled={currentpage == page}
                        >
                          {page}
                        </ButtonStyles>
                      );
                    })}
                    <ButtonStyles
                      {...getFwdButtonProps()}
                      disabled={goFwdBdisabled}
                    >
                      {">"}
                    </ButtonStyles>
                    <ButtonStyles
                      {...getFastFwdButtonProps()}
                      disabled={goFastFwdBdisabled}
                    >
                      {">>"}
                    </ButtonStyles>
                  </td>
                </tr>
              ]
            : null}
        </tbody>
      )}
    </ReactNextPaging>
  );
};

Paging.defaultProps = {
  itemsperpage: 10,
  pagesspan: 10,
  items: [],
};

Paging.propTypes = {
  itemsperpage: PropTypes.number,
  nocolumns: PropTypes.number.isRequired,
  pagesspan: PropTypes.number,
  items: PropTypes.array,
};