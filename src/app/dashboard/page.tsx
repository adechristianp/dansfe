"use client";
import { Button } from "@/components/button";
import { TextField } from "@/components/field";
import { Checkbox } from "@/components/field/checkbox";
import NavBar from "@/components/navbar";
import { useCallback, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [expire, setExpire] = useState<any>();
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState("");
    const [detail, setDetail] = useState<any>(undefined);

    const [jobDesc, setJobDesc] = useState('');
    const [loc, setLoc] = useState('');
    const [full, setFull] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    const [positions, setPositions] = useState([]);

    const axiosService = axios.create();
    axiosService.interceptors.request.use(async(config) => {
        const currentDate = new Date();
        if(expire * 1000 < currentDate.getTime() || !config.headers.Authorization){
            try {
                const response = await axios.get('http://127.0.0.1:7072/token', {
                    withCredentials: true,
                });
                config.headers.Authorization = `Bearer ${response.data.data.token}`;
                const decode: any = jwt_decode(response.data.data.token)
                setName(decode?.name);
                setExpire(decode?.exp);
            } catch (error) {
                router.push("/login")
            }
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    })

    const getPositions = useCallback(async (newToken?: any, page?: number) => {
        setLoading(true);
        const response = await axiosService.get('http://127.0.0.1:7072/positions', {
            params: {
                page: page || 1,
                description: jobDesc,
                location: loc,
                full_time: full
            },
            headers: {
                Authorization: `Bearer ${newToken ? newToken : token}`
            }
        })
        setPositions(response.data.data.positions);
        setTotalPage(response.data.data.totalPages);
        !page && setPage(1);
        setLoading(false);
    }, [axiosService, token, jobDesc, loc, full])

    const checkToken = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:7072/token', {
                withCredentials: true,
            });
            const decode: any = jwt_decode(response.data.data.token)
            setName(decode?.name);
            setExpire(decode?.exp);
            setToken(response.data.data.token);
            setReady(true);
            getPositions(response.data.data.token)
        } catch (error) {
            router.push("/login");
            return;
        }
    },[router])

    const handleDetail = (data: any) => {
        setDetail(data);
    }

    useEffect(()=>{
        checkToken();
    },[])

    useEffect(()=>{
        ready && getPositions(undefined, page)
    }, [page])

    const defaultScreen = () => {
        return (
            <>
                <div className=" px-9 pt-6">Hi, <span className=" font-semibold text-emerald-950">{name}</span></div>
                <div className=" h-auto flex px-9 pt-1 ">
                    <div className="flex flex-wrap gap-3 items-center">
                        <TextField
                            label="Job Description"
                            onChange={setJobDesc}
                            value={jobDesc}
                        />
                        <TextField
                            label="Location"
                            onChange={setLoc}
                            value={loc}
                        />
                        <div className=" mt-[24px]">
                            <Checkbox
                                label="Full Time Only"
                                checked={full}
                                onClick={setFull}
                            />
                        </div>
                        <div className=" mt-[24px]">
                            <Button
                                label="Search"
                                onClick={()=>{getPositions()}}
                            />
                        </div>
                    </div>
                </div>
                <div className="mx-9 mt-6 border-neutral-400 flex-1 border-[1px] rounded-lg p-4">
                    <div className="flex justify-between">
                        <div className=" font-extrabold text-2xl mb-8">Job List</div>
                        <div>{loading ? "Loading..." : null}</div>
                    </div>
                    {positions.map((data: any, i) => {
                        const date1 = new Date(data.created_at);
                        const date2 = new Date();
                        let diffDateText = '';
                        let diffDate = (date2.getTime() - date1.getTime())/ (1000 * 3600 * 24);
                        if(diffDate <= 30) diffDateText = `${Math.floor(diffDate)} day${diffDate>1 && 's'} ago`
                        if(diffDate > 30) diffDateText = `${Math.floor(diffDate/30)} month${diffDate>1 && 's'} ago`
                        if(diffDate > 30*12) diffDateText = `${Math.floor(diffDate/30/12)} year${diffDate>1 && 's'} ago`
                        diffDate = Math.floor(diffDate);
                        return(
                            <div key={i} onClick={()=>handleDetail(data)} className=" cursor-pointer border-t-[1px] border-neutral-400 flex-1 flex flex-row justify-between py-4">
                                <div>
                                    <div className=" text-lg font-bold">{data.title}</div>
                                    <div className=" text-sm text-gray-500">{data.company} - <span className=" text-green-600 font-bold">{data.type}</span></div>
                                </div>
                                <div className="self-center">
                                    <div className=" text-sm text-right">{data.location}</div>
                                    <div className=" text-sm text-gray-500 text-right">{diffDateText}</div>
                                </div>
                            </div>
                        )
                    })}
                    <div className=" flex justify-center my-4 gap-2">
                        <Button
                            label="Previous"
                            onClick={()=>{setPage(page-1)}}    
                            disabled={page===1}
                        />
                        <Button
                            label="Next"
                            onClick={()=>{setPage(page+1)}}    
                            disabled={page===totalPage}
                        />
                    </div>
                </div>
            </>
        )
    }

    const detailScreen = () => {
        const markupDesc = { __html: detail.description };
        const markupHowToApply = { __html: detail.how_to_apply };
        return (
            <div className=" px-6 py-6">
                <div onClick={()=> setDetail(undefined)} className=" cursor-pointer text-lg font-semibold text-green-600">{`< Back`}</div>
                <div className=" mt-6 border-neutral-400 flex-1 border-[1px] rounded-lg p-4">
                    <div className=" text-sm text-gray-400">{detail.type} / {detail.location}</div>
                    <div className=" text-2xl font-bold">{detail.title}</div>
                    <div className=" border-t-[1px] border-gray-400 flex mt-5 pt-4">
                        <div className=" flex-1" dangerouslySetInnerHTML={markupDesc} />
                        <div className="  ml-4 w-80 ">
                            <div className="border-neutral-400 flex-1 border-[1px] rounded-lg p-4">
                                <div className=" font-bold text-sm">{detail.company}</div>
                                <div className="border-t-[1px] border-neutral-400 pt-4 mt-4">
                                    <Image
                                        alt=""
                                        src={detail.company_logo}
                                        width={200}
                                        height={100}
                                        layout="responsive"
                                    />
                                </div>
                                <div className=" text-sm text-blue-600 underline">{detail.company_url}</div>
                            </div>
                            <div className="border-neutral-400 flex-1 border-[1px] rounded-lg p-4 bg-green-100  mt-4">
                                <div className="font-bold text-sm">How to apply</div>
                                <div className="border-t-[1px] border-neutral-400 pt-4 mt-4"  dangerouslySetInnerHTML={markupHowToApply} />
                                <div className=" text-sm text-blue-600 underline">{detail.company_url}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    
    console.log(detail)
    if(!ready) return;
    return (
        <div className=" pb-10">
            <NavBar/>
            {detail ? detailScreen() : defaultScreen()}
        </div>
    )
}
