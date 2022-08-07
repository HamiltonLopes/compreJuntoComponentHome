/* eslint-disable */
import React, { useState, useEffect } from 'react'
import Product from './Product'
import { useLazyQuery } from 'react-apollo'
import productsByIdentifier from './queries/productByIdentifier.graphql'

import IconEqual from './icons/IconEqual'
import IconRefresh from './icons/IconRefresh'
import { IconPlusLines, ButtonWithIcon, Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage, defineMessages } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { useOrderItems } from 'vtex.order-items/OrderItems'
import axios from 'axios';

const messages = defineMessages({
  title: {
    id: 'store/shelf.buy-together.title',
    defaultMessage: '',
  },
  totalProducts: {
    id: 'store/shelf.buy-together.total-products.label',
    defaultMessage: '',
  },
  changeLabel: {
    id: 'store/shelf.buy-together.change.label',
    defaultMessage: '',
  },
  removeLabel: {
    id: 'store/shelf.buy-together.remove.label',
    defaultMessage: '',
  },
  addLabel: {
    id: 'store/shelf.buy-together.add.label',
    defaultMessage: '',
  },
})

const CSS_HANDLES = [
  'buyTogetherContainer',
  'buyTogetherTitleContainer',
  'buyTogetherTitle',
  'buyTogetherProductContainer',
  'totalMessage',
  'totalValue',
]

interface itemsInfo {
  id: number
  seller: number
  quantity: number
}

function Suggestions() {
  const handles = useCssHandles(CSS_HANDLES)
  const { addItem } = useOrderItems()
  const [melhoresCombinacoes, setMelhoresCombinacoes] = useState<Array<any>>([]);

  useEffect((): any => async () => {
    if (melhoresCombinacoes?.length === 0) {
      const response: any = await axios.get(
        `http://localhost:3000/combinations-api/v1/raw-top-combinations`
      )

      let combinations = [{ "2": { "3": "10" } }];
      combinations = await response.data;
      let arrayItems: any[] = [];

      for (let i = 0; i < combinations.length; i++) {
        arrayItems.push(Object.keys(combinations[i])[0]);
        arrayItems.push(Object.keys(Object.values(combinations[i])[0])[0]);
      }
      setMelhoresCombinacoes(arrayItems);
      getItems({variables: { field: 'id', values: arrayItems }});
    }
  });

  const [ getItems, { data }] = useLazyQuery(productsByIdentifier);

  const getItemByIndex = (index: number) => {
    if (!data) return undefined;
    const itemID = melhoresCombinacoes[index];

    for (let i = 0; i < data.productsByIdentifier.length; i++) {
      if (itemID === data.productsByIdentifier[i].productId) {
        return data.productsByIdentifier[i];
      }
    }
    return null;
  }
  
  const [activeProductIndex, setActiveProductIndex] = useState<any>(0)
  const [firstItemPrice, setFirstItemPrice] = useState<any>(
    getItemByIndex(activeProductIndex)?.items[0].sellers[0]
      .commertialOffer.Price | 0
  )
  const [secondItemPrice, setSecondItemPrice] = useState<any>(
    getItemByIndex(activeProductIndex + 1)?.items[0].sellers[0]
      .commertialOffer.Price | 0
  )
  const [firstItemCartInfo, setFirstItemCartInfo] = useState<itemsInfo>({
    id: getItemByIndex(activeProductIndex)?.items[0].itemId,
    seller:
      getItemByIndex(activeProductIndex)?.items[0].sellers[0]
        .sellerId,
    quantity: 1,
  })

  const [secondItemCartInfo, setSecondItemCartInfo] = useState<itemsInfo>({
    id: getItemByIndex(activeProductIndex + 1)?.items[0].itemId,
    seller:
      getItemByIndex(activeProductIndex + 1)?.items[0].sellers[0]
        .sellerId,
    quantity: 1,
  })

  useEffect(() => {
    const newFirstItem = getItemByIndex(activeProductIndex);
    const newSecondItem = getItemByIndex(activeProductIndex + 1);
    setFirstItemPrice(
      newFirstItem?.items[0].sellers[0]
        .commertialOffer.Price
    )
    setSecondItemPrice(
      newSecondItem?.items[0].sellers[0]
        .commertialOffer.Price
    )
    setFirstItemCartInfo({
      id: newFirstItem?.items[0].itemId,
      seller:
        newFirstItem?.items[0].sellers[0]
          .sellerId,
      quantity: 1,
    })
    setSecondItemCartInfo({
      id: newSecondItem?.items[0].itemId,
      seller:
        newSecondItem?.items[0].sellers[0]
          .sellerId,
      quantity: 1,
    })
  }, [data, activeProductIndex])

  useEffect(() => {
    setTotalPrice(firstItemPrice + secondItemPrice)
  }, [firstItemPrice, secondItemPrice])

  const [totalPrice, setTotalPrice] = useState<any>(
    firstItemPrice + secondItemPrice
  )

  console.log(data)
  const handleChangeProduct = () => {
    setActiveProductIndex((prev: any) => {
      if (prev < melhoresCombinacoes.length - 2) return prev + 2
      else return 0
    })
  }

  const handleAddCart = () => {
    addItem([firstItemCartInfo, secondItemCartInfo])
  }

  return (
    !!data && (
      <div className={`flex-none tc ${handles.buyTogetherContainer}`}>
        <div className={`mv4 v-mid ${handles.buyTogetherTitleContainer}`}>
          <span className={`t-heading-3 ${handles.buyTogetherTitle}`}>
            <FormattedMessage {...messages.title} />
          </span>
        </div>
        <div className="tc nowrap mb3">
          <ButtonWithIcon
            icon={<IconRefresh />}
            variation="tertiary"
            onClick={handleChangeProduct}
          >
            <FormattedMessage {...messages.changeLabel} />
          </ButtonWithIcon>
        </div>
        <div className={handles.buyTogetherProductContainer}>
          <Product
            product={getItemByIndex(activeProductIndex)}
            setPrice={setFirstItemPrice}
            setProductInfo={setFirstItemCartInfo}
          />
          <div className="self-center ma5">
            <IconPlusLines size={30} />
          </div>
          <Product
            product={getItemByIndex(activeProductIndex + 1)}
            setPrice={setSecondItemPrice}
            setProductInfo={setSecondItemCartInfo}
          />
          <div className="self-center ma5">
            <IconEqual size={25} />
          </div>
          <div className="w-100 mh2 mh6-l w-20-l self-center">
            <div className={`mb5 ${handles.totalMessage}`}>
              <FormattedMessage {...messages.totalProducts} />
            </div>
            <div className={`mv5 ${handles.totalValue}`}>
              <FormattedCurrency value={totalPrice} />
            </div>
            <Button onClick={handleAddCart}>Adicionar ao Carrinho</Button>
          </div>
        </div>
      </div>
    )
  )
}

export default Suggestions
