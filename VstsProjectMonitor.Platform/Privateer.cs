using System;
using System.Linq;
using System.Reflection;

namespace VstsProjectMonitor.Platform
{
    public interface IPrivateer
    {
        T Object<T>(params object[] parameters) where T : class;
        void SetStaticField<T, TF>(T parentObject, string fieldName, TF value) where T : class where TF : class;
    }

    public class Privateer : IPrivateer
    {
        public T Object<T>(params object[] parameters) where T : class
        {
            ConstructorInfo constructorInfo = typeof(T).GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance, null, parameters.Select(p => p.GetType()).ToArray(), null);
            if (constructorInfo == null) throw new Exception("Test setup failure: Privateer failed to private constructor.");
            return (T) constructorInfo.Invoke(parameters);
        }

        public void SetStaticField<T, TF>(T parentObject, string fieldName, TF value) where T : class where TF : class
        {
            FieldInfo fieldInfo = typeof(T).GetField(fieldName, BindingFlags.Static | BindingFlags.GetField | BindingFlags.NonPublic);
            if (fieldInfo == null) throw new Exception("Test setup failure: Privateer failed to get static private field for value setting.");
            fieldInfo.SetValue(parentObject, value);
        }

        public TF GetInstanceField<T, TF>(T parentObject, string fieldName) where T : class
        {
            FieldInfo fieldInfo = typeof(T).GetField(fieldName, BindingFlags.GetField | BindingFlags.NonPublic | BindingFlags.Instance);
            if (fieldInfo == null) throw new Exception("Test setup failure: Privateer failed to get private field for value acquisition.");
            return (TF) fieldInfo.GetValue(parentObject);
        }
    }
}