using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MODEL
{
    public class LFMonitor
    {
        /// <summary>
        /// 监测数据
        /// </summary>
        public List<LFDelta> Datas { get; set; }

        /// <summary>
        /// 数据统计
        /// </summary>
        public List<DataStatistics> Statistics { get; set; }
    }
}
