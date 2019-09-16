export  default{
    data(){
        return{
            curOptionKey:'title'
        }
    },
    render(h){
        let attrsMapping={},mappingRender=[],option;//属性生成对象，根据render函数生成获取属性对应的控件
        let {echartOption,type}=this.$attrs.curOption;
        let MappingOption=require(`./../../setting/attrs-mapping/base-attr`).default;//映射全局通用控件
        let descOption=require(`./../../setting/attrs-desc/base-attr`).default;//映射全局通用属性描述
        let defaultModel=require(`./../../setting/attributes/base-attr`).default;//映射全局通用默认值
        let ChooseType=require(`./chooseAttr.vue`).default;
        echartOption?option={
            ...defaultModel,
            ...echartOption,
        }:option={};
        let deepIn=(val,mapping,descOption,option1)=>{
            for (const key in val) {
                    let element = val[key];
                    if(typeof element==='object'){
                        try {
                        option1[key]?undefined:option1[key]={};
                        } catch (error) {
                            
                        }
                        attrsMapping[key]?undefined:attrsMapping[key]={};
                        deepIn(element, attrsMapping[key],descOption[key],option1[key]);//深度遍历属性配置
                    }else{
                        if(typeof element==='function'){
                            mapping[key]=element(h,(val)=>{
                                option1[key]=val;
                                this.$bus.$emit('setOptionItem',option,this.$attrs.index);
                        },descOption[key],option1[key]);
                        // mappingRender.push(mapping[key])
                        }
                    }
            }
        }
    
        
        deepIn(MappingOption,attrsMapping,descOption,option);
        let deepGenerateDom=(h,val)=>{
            if(val.tag){
                return val;
            }else{
                return Object.keys(val).map((key)=>{
                    return <div>
                    {
                        deepGenerateDom(h,val[key])
                    }
                </div>
               });
            }
        }
        let setOption=(val)=>{
           this.curOptionKey=val;
        }
        let options=(function(){
            let arr=[];
            Object.keys(attrsMapping).forEach((item)=>{
                arr.push({
                    label:item,
                    value:item
                })
            })
            return arr;
        })();
        return(
            <div>
                <ChooseType options={options} setOption={setOption} />
                {this.a}
                {
                    Object.keys(attrsMapping).map((key)=>{
                      return  this.curOptionKey===key?<div>
                          {deepGenerateDom(h,attrsMapping[key]) }
                      </div>:undefined
                    })
                    // mappingRender.map((item,idx)=>(
                    //     <div key={idx}>
                    //         {item}
                    //     </div>
                    // ))
                }
                {
                }
            </div>
        )
    }
}