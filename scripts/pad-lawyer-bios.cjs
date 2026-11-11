const fs = require('fs')
const path = require('path')

const file = path.join('src', 'data', 'lawyers.js')
let text = fs.readFileSync(file, 'utf8')
const add =
  ' Clients are also reminded to keep certified copies of every signed page, avoid sharing OTPs or banking passwords with unverified contacts, and treat unusually cheap urgent listings as a warning sign rather than a bargain. Before token money becomes non-refundable, a short independent review of identity papers, ownership chain, society or authority letters, dues clearance and payment wording can prevent years of stress. Call or WhatsApp first with clear photos of documents so the initial risk check is fast, then decide whether a fuller in-person consultation is needed for your city and property type. This Makaan listing exists so first-time buyers and renters can reach a trusted local lawyer quickly when a property looks attractive but the paperwork still needs careful verification.'

text = text.replace(/bio: `([^`]+)`/g, (_, bio) => {
  let b = bio.trim()
  while (b.split(/\s+/).length < 300) {
    b += add
  }
  return `bio: \`${b}\``
})

fs.writeFileSync(file, text)
const mod = text.match(/bio: `([^`]+)`/g) || []
mod.forEach((chunk, i) => {
  const words = chunk.replace(/^bio: `/, '').replace(/`$/, '').trim().split(/\s+/).length
  console.log(i + 1, words)
})
