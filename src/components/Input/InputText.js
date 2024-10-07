import React from "react"

function InputText({
  labelTitle, 
  labelStyle, 
  type, 
  containerStyle, 
  defaultValue, 
  placeholder, 
  updateFormValue, 
  updateType, 
  labelButton, 
  labelButtonStyle,
  onLabelButtonClick,
  showPassword,
  togglePasswordVisibility
}){
    const updateInputValue = (val) => {
        updateFormValue({updateType, value : val})
    }

    return(
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <div className="flex items-center justify-between w-full">
                    <span className={"label-text text-base-content " + labelStyle}>{labelTitle}</span>
                    {labelButton && (
                        <button 
                            type="button"
                            className={`text-sm text-primary hover:text-primary-focus ${labelButtonStyle}`}
                            onClick={onLabelButtonClick}
                        >
                            {labelButton}
                        </button>
                    )}
                </div>
            </label>
            <div className="relative">
                <input 
                    type={type === 'password' && showPassword ? 'text' : type || "text"}
                    defaultValue={defaultValue}
                    placeholder={placeholder || ""} 
                    onChange={(e) => updateInputValue(e.target.value)} 
                    className="input input-bordered w-full pr-20" 
                />
                {type === 'password' && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-primary hover:text-primary-focus"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default InputText