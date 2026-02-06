;; YieldFlow Mock Vault
;; A simple yield-bearing vault that accepts USDCx deposits and simulates APY growth
;; Built for the Programming USDCx on Stacks Builder Challenge

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u401))
(define-constant ERR_INSUFFICIENT_BALANCE (err u402))
(define-constant ERR_ZERO_AMOUNT (err u403))
(define-constant ERR_TRANSFER_FAILED (err u404))
(define-constant ERR_VAULT_PAUSED (err u405))

;; Vault parameters
;; APY: 12% annual
;; Stacks blocks: ~10 minutes per block = ~6 blocks/hour = ~144 blocks/day = ~52560 blocks/year
;; Yield per block = 0.12 / 52560 = 0.00000228310502 = ~228 basis points per million blocks
;; To avoid decimals, we use: (principal * blocks * 228) / 100000000
(define-constant YIELD_NUMERATOR u228)
(define-constant YIELD_DENOMINATOR u100000000)

;; Token definition for receipt tokens
(define-fungible-token yf-receipt)

;; Data maps
(define-map deposits 
  principal 
  { 
    amount: uint, 
    deposit-block: uint 
  }
)

;; Data vars
(define-data-var total-deposits uint u0)
(define-data-var vault-name (string-ascii 32) "YieldFlow Mock Vault")
(define-data-var vault-symbol (string-ascii 10) "YF-VAULT")
(define-data-var paused bool false)

;; Public functions

;; Deposit USDCx into the vault
;; @param amount: Amount of USDCx to deposit (in micro-units)
;; @returns (response uint uint): The deposited amount or error code
(define-public (deposit (amount uint))
  (begin
    ;; Validations
    (asserts! (not (var-get paused)) ERR_VAULT_PAUSED)
    (asserts! (> amount u0) ERR_ZERO_AMOUNT)
    
    ;; Note: In a production contract, USDCx would be transferred here
    ;; For this mock vault, we'll just track the deposit
    ;; The transfer will be handled by post-conditions on the frontend
    
    ;; Mint receipt tokens to depositor
    (try! (ft-mint? yf-receipt amount tx-sender))
    
    ;; Update deposit record
    (let ((current-deposit (default-to { amount: u0, deposit-block: u0 } (map-get? deposits tx-sender))))
      (map-set deposits tx-sender {
        amount: (+ (get amount current-deposit) amount),
        deposit-block: block-height
      })
    )
    
    ;; Update total deposits
    (var-set total-deposits (+ (var-get total-deposits) amount))
    
    ;; Emit deposit event
    (print {
      event: "deposit",
      user: tx-sender,
      amount: amount,
      block: block-height,
      total-deposits: (var-get total-deposits)
    })
    
    (ok amount)
  )
)

;; Withdraw USDCx from the vault
;; @param amount: Amount to withdraw (in micro-units)
;; @returns (response uint uint): The withdrawn amount or error code
(define-public (withdraw (amount uint))
  (let (
    (caller tx-sender)
    (deposit-info (unwrap! (map-get? deposits caller) ERR_INSUFFICIENT_BALANCE))
    (deposited-amount (get amount deposit-info))
  )
    ;; Validations
    (asserts! (> amount u0) ERR_ZERO_AMOUNT)
    (asserts! (>= deposited-amount amount) ERR_INSUFFICIENT_BALANCE)
    
    ;; Burn receipt tokens
    (try! (ft-burn? yf-receipt amount caller))
    
    ;; Note: In production, USDCx would be transferred back here
    ;; For this mock, we just update state
    
    ;; Update deposit record
    (let ((remaining-amount (- deposited-amount amount)))
      (if (is-eq remaining-amount u0)
        (map-delete deposits caller)
        (map-set deposits caller {
          amount: remaining-amount,
          deposit-block: block-height
        })
      )
    )
    
    ;; Update total deposits
    (var-set total-deposits (- (var-get total-deposits) amount))
    
    ;; Emit withdrawal event
    (print {
      event: "withdraw",
      user: caller,
      amount: amount,
      block: block-height,
      total-deposits: (var-get total-deposits)
    })
    
    (ok amount)
  )
)

;; Withdraw with accrued yield
;; @returns (response uint uint): The total withdrawn amount including yield
(define-public (withdraw-with-yield)
  (let (
    (caller tx-sender)
    (deposit-info (unwrap! (map-get? deposits caller) ERR_INSUFFICIENT_BALANCE))
    (deposited-amount (get amount deposit-info))
    (total-with-yield (get-balance-with-yield caller))
    (yield-earned (- total-with-yield deposited-amount))
  )
    ;; Burn all receipt tokens
    (try! (ft-burn? yf-receipt deposited-amount caller))
    
    ;; Note: In production, USDCx (principal + yield) would be transferred back here
    ;; For this mock, we just update state and emit the yield amount
    
    ;; Delete deposit record (full withdrawal)
    (map-delete deposits caller)
    
    ;; Update total deposits
    (var-set total-deposits (- (var-get total-deposits) deposited-amount))
    
    ;; Emit withdrawal event with yield info
    (print {
      event: "withdraw-with-yield",
      user: caller,
      principal: deposited-amount,
      yield: yield-earned,
      total: total-with-yield,
      block: block-height,
      total-deposits: (var-get total-deposits)
    })
    
    (ok total-with-yield)
  )
)

;; Read-only functions

;; Get the principal amount deposited (without yield)
;; @param user: The principal address to check
;; @returns uint: The deposited amount
(define-read-only (get-deposit-amount (user principal))
  (default-to u0 (get amount (map-get? deposits user)))
)

;; Get the deposit block height
;; @param user: The principal address to check
;; @returns uint: The block height when deposit was made
(define-read-only (get-deposit-block (user principal))
  (default-to u0 (get deposit-block (map-get? deposits user)))
)

;; Calculate balance with simulated yield
;; @param user: The principal address to check
;; @returns uint: The balance including accrued yield
(define-read-only (get-balance-with-yield (user principal))
  (match (map-get? deposits user)
    deposit-info
      (let (
        (blocks-elapsed (- block-height (get deposit-block deposit-info)))
        (base-amount (get amount deposit-info))
        ;; Yield calculation: (amount * blocks * numerator) / denominator
        (yield-amount (/ (* (* base-amount blocks-elapsed) YIELD_NUMERATOR) YIELD_DENOMINATOR))
      )
        (+ base-amount yield-amount)
      )
    u0
  )
)

;; Get the total deposits in the vault (TVL)
;; @returns uint: Total value locked in the vault
(define-read-only (get-total-deposits)
  (var-get total-deposits)
)

;; Get the simulated APY as a percentage (basis points)
;; @returns uint: APY in basis points (1200 = 12.00%)
(define-read-only (get-apy)
  u1200 ;; 12% APY
)

;; Get vault metadata
;; @returns tuple with vault information
(define-read-only (get-vault-info)
  {
    name: (var-get vault-name),
    symbol: (var-get vault-symbol),
    apy: (get-apy),
    tvl: (var-get total-deposits)
  }
)

;; Get receipt token balance
;; @param user: The principal address to check
;; @returns uint: The receipt token balance
(define-read-only (get-receipt-balance (user principal))
  (ft-get-balance yf-receipt user)
)

;; Get estimated yield for a user
;; @param user: The principal address to check
;; @returns uint: The estimated accrued yield
(define-read-only (get-estimated-yield (user principal))
  (let (
    (balance-with-yield (get-balance-with-yield user))
    (principal-amount (get-deposit-amount user))
  )
    (if (> balance-with-yield principal-amount)
      (- balance-with-yield principal-amount)
      u0
    )
  )
)

;; Check if vault is paused
;; @returns bool: True if paused, false otherwise
(define-read-only (is-paused)
  (var-get paused)
)

;; Admin functions

;; Emergency pause: stops all deposits (owner only)
;; @returns (response bool uint): Success or error
(define-public (pause)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set paused true)
    (print { event: "vault-paused", by: tx-sender, block: block-height })
    (ok true)
  )
)

;; Unpause: resumes deposits (owner only)
;; @returns (response bool uint): Success or error
(define-public (unpause)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set paused false)
    (print { event: "vault-unpaused", by: tx-sender, block: block-height })
    (ok true)
  )
)

;; Update vault name (owner only)
;; @param new-name: New vault name
;; @returns (response bool uint): Success or error
(define-public (set-vault-name (new-name (string-ascii 32)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set vault-name new-name)
    (print { event: "vault-name-updated", new-name: new-name, by: tx-sender })
    (ok true)
  )
)

;; Update vault symbol (owner only)
;; @param new-symbol: New vault symbol
;; @returns (response bool uint): Success or error
(define-public (set-vault-symbol (new-symbol (string-ascii 10)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_AUTHORIZED)
    (var-set vault-symbol new-symbol)
    (print { event: "vault-symbol-updated", new-symbol: new-symbol, by: tx-sender })
    (ok true)
  )
)
