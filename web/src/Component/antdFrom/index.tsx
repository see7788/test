import React, { isValidElement, useMemo, FC, ReactNode } from "react"
import { Form, Button, Input, InputNumber, Space, Affix,  Switch } from "antd";
// import { useNavigate } from "react-router-dom"
import { createSchemaFieldRule } from 'antd-zod';
import { AnyZodObject, ZodError } from "zod"
// import { MinusCircleFilled, PlusCircleFilled } from "@ant-design/icons"
type base_t = string | number | boolean
export interface param_t<T extends Record<string, any>> {
    db: T,
    zobj: AnyZodObject;// Parameters<typeof createSchemaFieldRule>[0],
    api: Record<string, (db: T) => any>,
    dbCss?: { [k in keyof T]?: React.ReactNode }
}
type data_t = Record<
    string,
    base_t | Array<string> | Array<number> | Array<boolean> | Record<string, base_t>
>
const InputEdit: FC<{
    children: ReactNode
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>,
    value?: number
}> = ({ value, onChange, children }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <Input.TextArea
                style={{ flexGrow: 1, marginRight: 'auto' }}
                size="middle"
                autoSize={true}
                value={value || ""}
                onChange={onChange}
            />
            <Space size="small">
                {children}
            </Space>
        </div>
    )
}

export default <T extends Record<string, any>>({ db, zobj, api, dbCss }: param_t<T>) => {
    const [from] = Form.useForm<T>()
    // c = useResolvedPath("").pathname    
    const rule = createSchemaFieldRule(zobj);
    const getUi = (db: Record<string, any>): ReactNode => {
        return Object.entries(db).map(([k, v], i) => {
            if (typeof v === 'string') {
                return <Form.Item
                    key={k}
                    name={k}
                    label={k}
                    rules={[rule]}
                >
                    <Input size={"middle"} />
                </Form.Item>
            } else if (typeof v === 'number') {
                return <Form.Item
                    key={k}
                    name={k}
                    label={k}
                    rules={[rule]}
                >
                    <InputNumber size={"middle"} />
                </Form.Item>
            } else if (typeof v === 'boolean') {
                return <Form.Item
                    key={k}
                    name={k}
                    label={k}
                    rules={[rule]}
                >
                    <Switch />
                </Form.Item>
            } else if (isValidElement(v)) {
                return <Form.Item
                    key={k}
                    name={k}
                    label={k}
                    rules={[rule]}
                >
                    {v}
                </Form.Item>
            } else if (Array.isArray(v)) {
                return (
                    <Form.List
                        key={k}
                        name={k}
                    >
                        {(fields, { add, remove, move }) => (
                            <>
                                {
                                    fields.map((field, index) => {
                                        return (
                                            <Form.Item
                                                name={field.name}
                                                label={k}
                                                key={field.key}
                                                rules={[rule]}
                                            >
                                                <InputEdit key={index}>
                                                    <Button size={"small"} onClick={() => add()}>add</Button>
                                                    <Button size={"small"} onClick={() => remove(index)}>del</Button>
                                                    <Button size={"small"} onClick={() => move(0, -1)}>上移</Button>
                                                    <Button size={"small"} onClick={() => move(0, 1)}>下移</Button>
                                                </InputEdit>
                                            </Form.Item>
                                        )
                                    })
                                }
                                {fields.length > 0 ? null : <Form.Item label={k}>
                                    <Button onClick={() => add()} >add</Button>
                                </Form.Item>}
                            </>
                        )
                        }
                    </Form.List>
                )
            } else if (typeof v === 'object') {
                getUi(v)
            } else {
                return <Form.Item
                    key={k}
                    name={k}
                    label={k}
                    rules={[rule]}
                >
                    <Input.TextArea size={"middle"} autoSize={true} />
                </Form.Item>
            }
        })
    }

    const dbUi = useMemo(() => getUi({ ...db, ...dbCss }), [])
    // const go = useNavigate()
    const apiUi = useMemo(() => Object.keys(api).map((k, i) => {
        return (<Button
            key={i}
            size={"small"}
            htmlType="submit"
            type="default"
            onClick={async () => {
                const data = await from.validateFields()
                zobj.parseAsync(data)
                    .then(() => api[k](data))
                    // .then(() => go(".."))
                    .catch(error => {
                        if (error instanceof ZodError) {
                            console.error('Validation error:', error.issues);
                        } else {
                            throw error; // Re-throw the error if it's not a ZodError
                        }
                    })
            }}
            children={k}
        />)
    }), [])
    return (
        <Form
            form={from}
            size={"small"}
            layout={"horizontal"}
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            // labelWrap //允许换行，好像没啥用
            // onFieldsChange={onFieldsChange}
            initialValues={db}
            //onChange={e => console.log(from.getFieldsValue())}
            // onFinish={e=>{zobj.parseAsync}}//提交表单且数据验证成功后回调事件
            onFinishFailed={console.error}//提交表单且数据验证失败后回调事件
            //size={"small"}//设置字段组件的尺寸（仅限 antd 组件）
            //scrollToFirstError={true}//提交失败自动滚动到第一个错误字段
            autoComplete="off"//inptu组件是否自动输入
            spellCheck={false}//拼写检查
        >

            {dbUi}
            <Form.Item> <Affix offsetBottom={85}><Space >{apiUi}</Space></Affix></Form.Item>
        </Form>
    )
}