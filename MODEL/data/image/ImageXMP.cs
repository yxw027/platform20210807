﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MODEL
{
    public class ImageXMP
    {
        /// <summary>
        /// 1-照片创建时间
        /// </summary>
        public string CreateDate { get; set; }
        /// <summary>
        /// 2-照片修改时间
        /// </summary>
        public string ModifyDate { get; set; }
       /// <summary>
       /// 3-制造商
       /// </summary>
        public string Make { get; set; }
        /// <summary>
        /// 4-相机型号
        /// </summary>
        public string Model { get; set; }
        /// <summary>
        /// 5-照片格式
        /// </summary>
        public string Format { get; set; }
        /// <summary>
        /// 6-相机位置的纬度
        /// </summary>
        public double GpsLatitude { get; set; }
        /// <summary>
        /// 7-相机位置的经度
        /// </summary>
        public double GpsLongitude { get; set; }
        /// <summary>
        /// 8-相机位置的绝对高度，相对于椭球模型
        /// </summary>
        public double AbsoluteAltitude { get; set; }
        /// <summary>
        /// 9-相机位置的相对高度，相对于Home点
        /// </summary>
        public double? RelativeAltitude { get; set; }
        /// <summary>
        /// 10-云台Roll角        
        /// </summary>
        public double? GimbalRollDegree { get; set; }
        /// <summary>
        /// 11-云台Yaw角
        /// </summary>
        public double? GimbalYawDegree { get; set; }
        /// <summary>
        /// 12-云台Pitcg角
        /// </summary>
        public double? GimbalPitchDegree { get; set; }
        /// <summary>
        /// 13-飞机Roll角
        /// </summary>       
        public double? FlightRollDegree { get; set; }
        /// <summary>
        /// 14-飞机Yaw角
        /// </summary>
        public double? FlightYawDegree { get; set; }
        /// <summary>
        /// 15-飞机Pitcg角
        /// </summary>
        public double? FlightPitchDegree { get; set; }               
        /// <summary>
        /// 16-北方向对地速度（地轴系，m/s）
        /// </summary>
        public double? FlightXSpeed { get; set; }
        /// <summary>
        /// 17-东方向对地速度（地轴系，m/s）
        /// </summary>
        public double? FlightYSpeed { get; set; }
        /// <summary>
        /// 18-地方向对地速度（地轴系，m/s）
        /// </summary>
        public double? FlightZSpeed { get; set; }
        /// <summary>
        /// 19-RTK状态位,50为固定解
        /// </summary>
        public int? RtkFlag { get; set; }
        /// <summary>
        /// 20-相片记录位置在经度方向的定位标准差，单位米，当使用RTK模式输出的照片进行建图且此值大于0.1时，不推荐使用该照片。
        /// </summary>
        public double? RtkStdLon { get; set; }
        /// <summary>
        /// 21-相片记录位置在纬度方向的定位标准差，单位米，当使用RTK模式输出的照片进行建图且此值大于0.1时，不推荐使用该照片。
        /// </summary>
        public double? RtkStdLat { get; set; }
        /// <summary>
        /// 22-相片记录位置在高度方向的定位标准差，单位米，当使用RTK模式输出的照片进行建图且此值大于0.1时，不推荐使用该照片。
        /// </summary>
        public double? RtkStdHgt { get; set; }
        /// <summary>
        /// 23-测量模式
        /// </summary>
        public string SurveyingMode { get; set; }
        /// <summary>
        /// 24-快门数
        /// </summary>
        public string ShutterCount { get; set; }
        /// <summary>
        /// 25-相机序列号
        /// </summary>
        public string CameraSerialNumber { get; set; }
        /// <summary>
        /// 26-镜头序列号
        /// </summary>
        public string LensSerialNumber { get; set; }
        /// <summary>
        /// 27-无人机模型
        /// </summary>
        public string DroneModel { get; set; }
        /// <summary>
        /// 28-无人机序列号
        /// </summary>
        public string DroneSerialNumber { get; set; }
        /// <summary>
        /// 29-版本
        /// </summary>
        public string Version { get; set; }

        /// <summary>
        /// 30-焦距
        /// </summary>
        public double f { get; set; }





    }
}
